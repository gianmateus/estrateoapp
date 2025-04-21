import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Interfaces
export interface ItemInventario {
  id: string;
  nome: string;
  quantidade: number;
  unidade: 'kg' | 'unidade' | 'caixa';
  precoUnitario: number;
  categoria: string;
  fornecedor?: string;
  estoqueMinimo?: number;
  estoqueMaximo?: number;
  localizacao?: string;
  dataAtualizacao?: string;
}

export interface MovimentacaoInventario {
  id: string;
  itemId: string;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  data: string;
  responsavel: string;
  motivo?: string;
}

export interface ResumoInventario {
  totalItens: number;
  valorTotal: number;
  itensAbaixoMinimo: number;
  ultimaAtualizacao: string;
}

interface InventarioContextType {
  itens: ItemInventario[];
  movimentacoes: MovimentacaoInventario[];
  resumo: ResumoInventario;
  adicionarItem: (item: Omit<ItemInventario, 'id' | 'dataAtualizacao'>) => void;
  atualizarItem: (id: string, item: Partial<Omit<ItemInventario, 'id' | 'dataAtualizacao'>>) => void;
  removerItem: (id: string) => void;
  registrarMovimentacao: (movimentacao: Omit<MovimentacaoInventario, 'id'>) => void;
  buscarItem: (id: string) => ItemInventario | undefined;
  buscarItensPorCategoria: (categoria: string) => ItemInventario[];
  carregarDados: () => void;
}

// Chaves para armazenamento no localStorage
const STORAGE_KEYS = {
  itens: 'inventario_itens',
  movimentacoes: 'inventario_movimentacoes',
  resumo: 'inventario_resumo'
};

// Valores iniciais
const resumoInicial: ResumoInventario = {
  totalItens: 0,
  valorTotal: 0,
  itensAbaixoMinimo: 0,
  ultimaAtualizacao: new Date().toISOString()
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

  // Função para calcular o resumo com base nos itens atuais
  const calcularResumo = (itensInventario: ItemInventario[]): ResumoInventario => {
    const valorTotal = itensInventario.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
    const itensAbaixoMinimo = itensInventario.filter(item => item.estoqueMinimo !== undefined && item.quantidade < item.estoqueMinimo).length;

    return {
      totalItens: itensInventario.length,
      valorTotal,
      itensAbaixoMinimo,
      ultimaAtualizacao: new Date().toISOString()
    };
  };

  // Função para carregar os dados do localStorage
  const carregarDados = () => {
    try {
      // Carregar itens
      const itensStr = localStorage.getItem(STORAGE_KEYS.itens);
      if (itensStr) {
        const itensCarregados = JSON.parse(itensStr);
        setItens(itensCarregados);

        // Recalcular resumo
        const novoResumo = calcularResumo(itensCarregados);
        setResumo(novoResumo);
        localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(novoResumo));
      }

      // Carregar movimentações
      const movimentacoesStr = localStorage.getItem(STORAGE_KEYS.movimentacoes);
      if (movimentacoesStr) {
        setMovimentacoes(JSON.parse(movimentacoesStr));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do inventário:', error);
    }
  };

  // Carregar dados ao inicializar o componente
  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para adicionar um novo item
  const adicionarItem = (novoItem: Omit<ItemInventario, 'id' | 'dataAtualizacao'>) => {
    const item: ItemInventario = {
      ...novoItem,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dataAtualizacao: new Date().toISOString()
    };

    const novosItens = [...itens, item];
    setItens(novosItens);

    // Atualizar resumo
    const novoResumo = calcularResumo(novosItens);
    setResumo(novoResumo);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(novosItens));
    localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(novoResumo));
  };

  // Função para atualizar um item existente
  const atualizarItem = (id: string, dadosAtualizados: Partial<Omit<ItemInventario, 'id' | 'dataAtualizacao'>>) => {
    const novosItens = itens.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...dadosAtualizados,
          dataAtualizacao: new Date().toISOString()
        };
      }
      return item;
    });

    setItens(novosItens);

    // Atualizar resumo
    const novoResumo = calcularResumo(novosItens);
    setResumo(novoResumo);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(novosItens));
    localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(novoResumo));
  };

  // Função para remover um item
  const removerItem = (id: string) => {
    const novosItens = itens.filter(item => item.id !== id);
    setItens(novosItens);

    // Atualizar resumo
    const novoResumo = calcularResumo(novosItens);
    setResumo(novoResumo);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(novosItens));
    localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(novoResumo));
  };

  // Função para registrar uma movimentação de inventário e atualizar o item
  const registrarMovimentacao = (novaMovimentacao: Omit<MovimentacaoInventario, 'id'>) => {
    const movimentacao: MovimentacaoInventario = {
      ...novaMovimentacao,
      id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Adicionar movimentação ao histórico
    const novasMovimentacoes = [...movimentacoes, movimentacao];
    setMovimentacoes(novasMovimentacoes);
    localStorage.setItem(STORAGE_KEYS.movimentacoes, JSON.stringify(novasMovimentacoes));

    // Atualizar o item correspondente
    const itemIndex = itens.findIndex(item => item.id === movimentacao.itemId);
    if (itemIndex >= 0) {
      const novosItens = [...itens];
      const item = novosItens[itemIndex];

      // Calcular nova quantidade baseada no tipo de movimentação
      let novaQuantidade = item.quantidade;
      if (movimentacao.tipo === 'entrada') {
        novaQuantidade += movimentacao.quantidade;
      } else if (movimentacao.tipo === 'saida') {
        novaQuantidade -= movimentacao.quantidade;
      } else if (movimentacao.tipo === 'ajuste') {
        novaQuantidade = movimentacao.quantidade;
      }

      // Atualizar o item
      novosItens[itemIndex] = {
        ...item,
        quantidade: novaQuantidade,
        dataAtualizacao: new Date().toISOString()
      };

      setItens(novosItens);

      // Atualizar resumo
      const novoResumo = calcularResumo(novosItens);
      setResumo(novoResumo);

      // Persistir no localStorage
      localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(novosItens));
      localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(novoResumo));
    }
  };

  // Função para buscar um item específico pelo ID
  const buscarItem = (id: string): ItemInventario | undefined => {
    return itens.find(item => item.id === id);
  };

  // Função para buscar itens por categoria
  const buscarItensPorCategoria = (categoria: string): ItemInventario[] => {
    return itens.filter(item => item.categoria === categoria);
  };

  return (
    <InventarioContext.Provider
      value={{
        itens,
        movimentacoes,
        resumo,
        adicionarItem,
        atualizarItem,
        removerItem,
        registrarMovimentacao,
        buscarItem,
        buscarItensPorCategoria,
        carregarDados
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
};

export default InventarioContext; 