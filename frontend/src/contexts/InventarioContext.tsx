import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { EventBus } from '../services/EventBus';
import api from '../services/api';

// Função para calcular a necessidade semanal baseada na periodicidade
export const calcularNecessidadeSemanal = (
  quantidadeIdeal: number,
  periodicidade: 'diario' | 'semanal' | 'mensal' | 'trimestral' = 'semanal'
): number => {
  switch (periodicidade) {
    case 'diario':
      return quantidadeIdeal * 7; // Necessidade diária x 7 dias da semana
    case 'semanal':
      return quantidadeIdeal; // A necessidade já é semanal
    case 'mensal':
      return quantidadeIdeal / 4; // Divide por 4 semanas no mês
    case 'trimestral':
      return quantidadeIdeal / 13; // Divide por 13 semanas no trimestre
    default:
      return quantidadeIdeal; // Fallback para semanal
  }
};

// Função para calcular a sugestão de compra
export const calcularSugestaoCompra = (
  estoqueAtual: number,
  quantidadeIdeal: number,
  periodicidade: 'diario' | 'semanal' | 'mensal' | 'trimestral' = 'semanal'
): number => {
  const necessidadeSemanal = calcularNecessidadeSemanal(quantidadeIdeal, periodicidade);
  return Math.max(0, necessidadeSemanal - estoqueAtual);
};

// Interfaces
export interface ItemInventario {
  id: string;
  nome: string;
  quantidade: number;
  preco: number; // Preço de venda
  codigoEAN?: string; // Código EAN europeu
  fornecedor?: string; // Nome do fornecedor
  precoCompra?: number; // Preço de compra
  unidadeMedida: string; // Unidade de medida (kg, g, unidade, etc.)
  dataValidade?: Date | string; // Data de validade do produto
  nivelMinimoEstoque?: number; // Quantidade mínima de estoque
  periodicidadeNecessidade?: 'diario' | 'semanal' | 'mensal' | 'trimestral'; // Periodicidade de necessidade do estoque
  localizacaoArmazem?: string; // Localização no armazém/estoque
  categoria?: string; // Categoria do produto
  descricao?: string; // Descrição do produto
  foto?: string; // URL da foto do produto
  createdAt: string;
  updatedAt: string;
}

export interface MovimentacaoInventario {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo?: string;
  responsavel?: string;
  dataMovimentacao: string;
}

export interface ResumoInventario {
  totalItens: number;
  valorTotalCompra: number;
  valorTotalVenda: number;
  lucroPotencial: number;
  itensCriticos: number;
  itensValidadeProxima: number;
  ultimaAtualizacao: string;
  categorias: Record<string, number>;
}

interface InventarioContextType {
  itens: ItemInventario[];
  movimentacoes: MovimentacaoInventario[];
  resumo: ResumoInventario;
  loading: boolean;
  error: string | null;
  adicionarItem: (item: Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  atualizarItem: (id: string, item: Partial<Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  removerItem: (id: string) => Promise<void>;
  registrarMovimentacao: (movimentacao: Omit<MovimentacaoInventario, 'id'>) => void;
  buscarItem: (id: string) => Promise<ItemInventario | undefined>;
  buscarItensPorCategoria: (categoria: string) => Promise<ItemInventario[]>;
  carregarDados: () => Promise<ItemInventario[]>;
  buscarCategorias: () => Promise<string[]>;
  exportarInventario: (formato: 'json' | 'csv') => Promise<void>;
  filtrarItens: (filtros: Record<string, any>, pagina: number, limite: number) => Promise<{ itens: ItemInventario[], pagination: { total: number, page: number, limit: number, pages: number } }>;
}

// Valores iniciais
const resumoInicial: ResumoInventario = {
  totalItens: 0,
  valorTotalCompra: 0,
  valorTotalVenda: 0,
  lucroPotencial: 0,
  itensCriticos: 0,
  itensValidadeProxima: 0,
  ultimaAtualizacao: new Date().toISOString(),
  categorias: {}
};

// Criação do contexto
const InventarioContext = createContext<InventarioContextType>({} as InventarioContextType);

// Hook para usar o contexto
export const useInventario = () => useContext(InventarioContext);

interface InventarioProviderProps {
  children: ReactNode;
}

export const InventarioProvider: React.FC<InventarioProviderProps> = ({ children }) => {
  const [itens, setItens] = useState<ItemInventario[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoInventario[]>([]);
  const [resumo, setResumo] = useState<ResumoInventario>(resumoInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar dados do backend e do localStorage
  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    
    let itensCarregados: ItemInventario[] = [];
    let usouFallback = false;
    
    try {
      // Tentar carregar do backend primeiro
      const response = await api.get('/inventario');
      itensCarregados = response.data.itens || response.data;

      // Carregar resumo
      try {
        const resumoResponse = await api.get('/inventario/resumo');
        setResumo({
          ...resumoResponse.data,
          ultimaAtualizacao: new Date().toISOString()
        });
      } catch (resumoError) {
        console.error('Erro ao carregar resumo, usando dados padrão:', resumoError);
        setResumo({
          totalItens: itensCarregados.length,
          valorTotalCompra: 0,
          valorTotalVenda: 0,
          lucroPotencial: 0,
          itensCriticos: 0,
          itensValidadeProxima: 0,
          ultimaAtualizacao: new Date().toISOString(),
          categorias: {}
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do inventário do backend:', error);
      usouFallback = true;
      setError('Falha ao carregar dados do inventário do backend');
      
      // Carregar itens do localStorage (modo offline/fallback)
      try {
        const itensMock = JSON.parse(localStorage.getItem('mockInventario') || '[]');
        console.log('Usando itens do localStorage como fallback:', itensMock.length, 'itens encontrados');
        itensCarregados = itensMock;
        
        // Atualizar resumo com os dados locais
        setResumo({
          totalItens: itensCarregados.length,
          valorTotalCompra: itensCarregados.reduce((total, item) => total + ((item.precoCompra || 0) * item.quantidade), 0),
          valorTotalVenda: itensCarregados.reduce((total, item) => total + ((item.preco || 0) * item.quantidade), 0),
          lucroPotencial: 0, // Calculado automaticamente depois
          itensCriticos: 0,  // Não temos como saber sem a lógica do backend
          itensValidadeProxima: 0, // Não temos como saber sem a lógica do backend
          ultimaAtualizacao: new Date().toISOString(),
          categorias: {}
        });
      } catch (localError) {
        console.error('Erro ao carregar dados do localStorage:', localError);
      }
    }

    if (itensCarregados.length > 0) {
      // Se chegou aqui, a comunicação com o backend foi bem-sucedida
      // Mas ainda podemos ter itens no localStorage que precisam ser exibidos
      // e eventualmente sincronizados com o backend quando ele voltar online
      
      try {
        const itensMock = JSON.parse(localStorage.getItem('mockInventario') || '[]');
        if (itensMock.length > 0) {
          console.log('Encontrados', itensMock.length, 'itens no localStorage para combinar com backend');
          
          // Filtrar para não duplicar itens do backend (comparando por ID)
          const idsBackend = new Set(itensCarregados.map(item => item.id));
          
          // Pegar apenas os itens que têm IDs com prefixo "local_"
          const itensApenasLocal = itensMock.filter((item: ItemInventario) => 
            item.id.startsWith('local_') && !idsBackend.has(item.id)
          );
          
          if (itensApenasLocal.length > 0) {
            console.log('Adicionando', itensApenasLocal.length, 'itens do localStorage aos itens do backend');
            itensCarregados = [...itensCarregados, ...itensApenasLocal];
            
            // TODO: Implementar sincronização dos itens locais com o backend quando online
          }
        }
      } catch (localError) {
        console.error('Erro ao combinar dados do localStorage com backend:', localError);
      }
    }

    // Definir itens carregados (do backend ou localStorage)
    setItens(itensCarregados);
    setLoading(false);
    
    // Se usou fallback, mostrar alerta para o usuário
    if (usouFallback && itensCarregados.length > 0) {
      console.info('Usando dados locais (offline mode) - ', itensCarregados.length, 'itens carregados');
    }
    
    return itensCarregados;
  };

  // Carregar dados ao inicializar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para adicionar um novo item
  const adicionarItem = async (novoItem: Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Tentar adicionar via API
      const response = await api.post('/inventario', novoItem);
      
      if (response.data && response.data.item) {
        // Atualizar a lista de itens e o resumo
        await carregarDados();
        return response.data.item;
      }
    } catch (error) {
      console.error('Erro ao adicionar item ao inventário via API:', error);
      setError('Falha ao adicionar item via servidor');
      
      // Modo offline/fallback - criar um ID local e salvar no localStorage
      try {
        console.log('Usando modo offline para adicionar item');
        const mockId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Criar o novo item com ID local
        const itemLocal: ItemInventario = {
          id: mockId,
          ...novoItem,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Adicionar ao estado local
        const novosItens = [...itens, itemLocal];
        setItens(novosItens);
        
        // Atualizar localStorage
        const itensAtuais = JSON.parse(localStorage.getItem('mockInventario') || '[]');
        itensAtuais.push(itemLocal);
        localStorage.setItem('mockInventario', JSON.stringify(itensAtuais));
        
        // Atualizar o resumo
        setResumo(prev => ({
          ...prev,
          totalItens: (prev.totalItens || 0) + 1,
          valorTotalCompra: (prev.valorTotalCompra || 0) + ((itemLocal.precoCompra || 0) * itemLocal.quantidade),
          valorTotalVenda: (prev.valorTotalVenda || 0) + (itemLocal.preco * itemLocal.quantidade),
        }));
        
        console.log('Item adicionado no modo offline com sucesso:', itemLocal);
        return itemLocal;
      } catch (localError) {
        console.error('Erro também ao adicionar item em modo offline:', localError);
        throw localError;
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar um item existente
  const atualizarItem = async (id: string, dadosAtualizados: Partial<Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      // Tentar atualizar via API
      const response = await api.put(`/inventario/${id}`, dadosAtualizados);
      
      if (response.data && response.data.item) {
        // Atualizar a lista de itens e o resumo
        await carregarDados();
        return response.data.item;
      }
    } catch (error) {
      console.error('Erro ao atualizar item do inventário via API:', error);
      setError('Falha ao atualizar item via servidor');
      
      // Modo offline/fallback - atualizar no localStorage
      try {
        console.log('Usando modo offline para atualizar item:', id);
        
        // Verificar se o item existe no estado atual
        const itemExistente = itens.find(item => item.id === id);
        if (!itemExistente) {
          throw new Error('Item não encontrado no modo offline');
        }
        
        // Criar o item atualizado
        const itemAtualizado: ItemInventario = {
          ...itemExistente,
          ...dadosAtualizados,
          updatedAt: new Date().toISOString()
        };
        
        // Atualizar o estado local (substituir o item antigo pelo novo)
        const novosItens = itens.map(item => item.id === id ? itemAtualizado : item);
        setItens(novosItens);
        
        // Atualizar no localStorage
        const itensAtuais = JSON.parse(localStorage.getItem('mockInventario') || '[]');
        const indiceItem = itensAtuais.findIndex((item: any) => item.id === id);
        
        if (indiceItem !== -1) {
          itensAtuais[indiceItem] = itemAtualizado;
          localStorage.setItem('mockInventario', JSON.stringify(itensAtuais));
        } else {
          // Se não existir no localStorage mas existir no estado, adicionar
          itensAtuais.push(itemAtualizado);
          localStorage.setItem('mockInventario', JSON.stringify(itensAtuais));
        }
        
        // Atualizar resumo (cálculo simplificado)
        // Em uma aplicação real, isso seria mais complexo
        setResumo(prev => ({
          ...prev,
          ultimaAtualizacao: new Date().toISOString()
        }));
        
        console.log('Item atualizado no modo offline com sucesso:', itemAtualizado);
        return itemAtualizado;
      } catch (localError) {
        console.error('Erro também ao atualizar item em modo offline:', localError);
        throw localError;
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para remover um item
  const removerItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Tentar remover via API
      await api.delete(`/inventario/${id}`);
      
      // Atualizar a lista de itens e o resumo
      await carregarDados();
    } catch (error) {
      console.error('Erro ao remover item do inventário via API:', error);
      setError('Falha ao remover item via servidor');
      
      // Modo offline/fallback - remover do localStorage
      try {
        console.log('Usando modo offline para remover item:', id);
        
        // Remover do estado local
        const itemARemover = itens.find(item => item.id === id);
        if (!itemARemover) {
          throw new Error('Item não encontrado no modo offline');
        }
        
        // Remover do estado
        const novosItens = itens.filter(item => item.id !== id);
        setItens(novosItens);
        
        // Remover do localStorage
        const itensAtuais = JSON.parse(localStorage.getItem('mockInventario') || '[]');
        const itensAtualizados = itensAtuais.filter((item: any) => item.id !== id);
        localStorage.setItem('mockInventario', JSON.stringify(itensAtualizados));
        
        // Atualizar resumo
        setResumo(prev => ({
          ...prev,
          totalItens: Math.max(0, (prev.totalItens || 0) - 1),
          valorTotalCompra: Math.max(0, (prev.valorTotalCompra || 0) - ((itemARemover.precoCompra || 0) * itemARemover.quantidade)),
          valorTotalVenda: Math.max(0, (prev.valorTotalVenda || 0) - (itemARemover.preco * itemARemover.quantidade)),
          ultimaAtualizacao: new Date().toISOString()
        }));
        
        console.log('Item removido no modo offline com sucesso:', id);
      } catch (localError) {
        console.error('Erro também ao remover item em modo offline:', localError);
        throw localError;
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para registrar uma movimentação de inventário (simulada por enquanto)
  const registrarMovimentacao = (novaMovimentacao: Omit<MovimentacaoInventario, 'id'>) => {
    const movimentacao: MovimentacaoInventario = {
      ...novaMovimentacao,
      id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Adicionar movimentação ao histórico (local por enquanto)
    const novasMovimentacoes = [...movimentacoes, movimentacao];
    setMovimentacoes(novasMovimentacoes);

    // Na versão real, chamaríamos a API para registrar a movimentação
    // E atualizaríamos o item correspondente
  };

  // Função para buscar um item específico pelo ID
  const buscarItem = async (id: string): Promise<ItemInventario | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/inventario/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar item do inventário:', error);
      setError('Falha ao buscar item');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar itens por categoria usando a API
  const buscarItensPorCategoria = async (categoria: string): Promise<ItemInventario[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/inventario', {
        params: { categoria }
      });
      return response.data.itens || response.data;
    } catch (error) {
      console.error('Erro ao buscar itens por categoria:', error);
      setError('Falha ao buscar itens por categoria');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar categorias disponíveis
  const buscarCategorias = async (): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/inventario/categorias');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError('Falha ao buscar categorias');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Função para exportar o inventário
  const exportarInventario = async (formato: 'json' | 'csv') => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/inventario/exportar', {
        params: { formato },
        responseType: formato === 'csv' ? 'blob' : 'json'
      });

      if (formato === 'csv') {
        // Criar um objeto URL para o blob e fazer o download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inventario.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Erro ao exportar inventário:', error);
      setError('Falha ao exportar inventário');
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar itens com paginação
  const filtrarItens = async (filtros: Record<string, any>, pagina: number, limite: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/inventario', {
        params: {
          ...filtros,
          page: pagina,
          limit: limite
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao filtrar itens do inventário:', error);
      setError('Falha ao filtrar itens');
      return { itens: [], pagination: { total: 0, page: 1, limit: limite, pages: 0 } };
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventarioContext.Provider
      value={{
        itens,
        movimentacoes,
        resumo,
        loading,
        error,
        adicionarItem,
        atualizarItem,
        removerItem,
        registrarMovimentacao,
        buscarItem,
        buscarItensPorCategoria,
        carregarDados,
        buscarCategorias,
        exportarInventario,
        filtrarItens
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
};

export default InventarioContext; 