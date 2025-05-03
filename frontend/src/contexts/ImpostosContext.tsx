import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { EventBus } from '../services/EventBus';
import { 
  ConfiguracaoImposto, 
  ImpostoAplicado, 
  ResumoImpostos,
  ImpostoProduto,
  TipoImposto,
  PeriodicidadeImposto
} from '../types/Impostos';

// Chaves para armazenamento no localStorage
const STORAGE_KEYS = {
  configuracoes: 'estrateo_impostos_configuracoes',
  impostos: 'estrateo_impostos_aplicados',
  resumo: 'estrateo_impostos_resumo',
  produtosImposto: 'estrateo_impostos_produtos'
};

// Adicionar tipos de eventos ao EventBus (temporário até atualizar o EventBus.ts)
// @ts-ignore
EventBus.emit = ((originalEmit) => {
  return function(eventName: string, data: any) {
    // @ts-ignore
    return originalEmit.call(this, eventName, data);
  };
})(EventBus.emit);

// Interface para o contexto
interface ImpostosContextData {
  // Dados
  configuracoes: ConfiguracaoImposto[];
  impostos: ImpostoAplicado[];
  resumo: ResumoImpostos;
  produtosImposto: ImpostoProduto[];
  
  // Ações para configurações de impostos
  adicionarConfiguracao: (config: Omit<ConfiguracaoImposto, 'id' | 'dataAtualizacao'>) => void;
  atualizarConfiguracao: (id: string, dados: Partial<Omit<ConfiguracaoImposto, 'id' | 'dataAtualizacao'>>) => void;
  removerConfiguracao: (id: string) => void;
  buscarConfiguracao: (id: string) => ConfiguracaoImposto | undefined;
  listarConfiguracoesPorPais: (pais: string) => ConfiguracaoImposto[];
  listarConfiguracoesPorTipo: (tipo: TipoImposto) => ConfiguracaoImposto[];
  
  // Ações para impostos aplicados
  registrarImposto: (imposto: Omit<ImpostoAplicado, 'id'>) => void;
  atualizarImposto: (id: string, dados: Partial<Omit<ImpostoAplicado, 'id'>>) => void;
  removerImposto: (id: string) => void;
  buscarImposto: (id: string) => ImpostoAplicado | undefined;
  listarImpostosPorTransacao: (transacaoId: string) => ImpostoAplicado[];
  pagarImposto: (id: string, dataPagamento: string, referencia?: string) => void;
  
  // Ações para impostos de produtos
  adicionarImpostoProduto: (imposto: Omit<ImpostoProduto, 'id'>) => void;
  atualizarImpostoProduto: (id: string, dados: Partial<Omit<ImpostoProduto, 'id'>>) => void;
  removerImpostoProduto: (id: string) => void;
  buscarImpostoProduto: (produtoId: string, configId: string) => ImpostoProduto | undefined;
  listarImpostosPorProduto: (produtoId: string) => ImpostoProduto[];
  
  // Cálculos
  calcularImpostoTransacao: (valorBase: number, aliquotas: number[], tipoBase?: 'bruto' | 'liquido') => {
    valorBruto: number;
    valorLiquido: number;
    valorImpostos: number;
  };
  verificarDeclaracoesPendentes: () => ImpostoAplicado[];
  verificarVencimentosProximos: (diasLimite?: number) => ImpostoAplicado[];
  
  // Utilitários
  atualizarResumo: () => void;
}

// Criação do contexto
const ImpostosContext = createContext<ImpostosContextData>({} as ImpostosContextData);

// Props para o provider
interface ImpostosProviderProps {
  children: ReactNode;
}

// Provider
export const ImpostosProvider: React.FC<ImpostosProviderProps> = ({ children }) => {
  // Estados
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoImposto[]>([]);
  const [impostos, setImpostos] = useState<ImpostoAplicado[]>([]);
  const [produtosImposto, setProdutosImposto] = useState<ImpostoProduto[]>([]);
  const [resumo, setResumo] = useState<ResumoImpostos>({
    totalArrecadado: 0,
    totalPago: 0,
    totalPendente: 0,
    proximosVencimentos: {
      proximos30Dias: 0,
      proximos60Dias: 0,
      vencidos: 0
    },
    porTipo: {},
    porPais: {},
    ultimaAtualizacao: new Date().toISOString()
  });

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedConfiguracoes = localStorage.getItem(STORAGE_KEYS.configuracoes);
    const storedImpostos = localStorage.getItem(STORAGE_KEYS.impostos);
    const storedResumo = localStorage.getItem(STORAGE_KEYS.resumo);
    const storedProdutosImposto = localStorage.getItem(STORAGE_KEYS.produtosImposto);

    if (storedConfiguracoes) setConfiguracoes(JSON.parse(storedConfiguracoes));
    if (storedImpostos) setImpostos(JSON.parse(storedImpostos));
    if (storedResumo) setResumo(JSON.parse(storedResumo));
    if (storedProdutosImposto) setProdutosImposto(JSON.parse(storedProdutosImposto));
    
    // Se não tiver dados carregados, criar dados de demonstração
    if (!storedConfiguracoes || JSON.parse(storedConfiguracoes).length === 0) {
      const configsDemo: ConfiguracaoImposto[] = [
        {
          id: 'impconfig_1',
          tipo: 'ust',
          nome: 'Umsatzsteuer 19%',
          aliquota: 19,
          descricao: 'Imposto sobre valor agregado padrão na Alemanha',
          aplicavelEntrada: true,
          aplicavelSaida: true,
          aplicavelEstoque: true,
          periodicidade: 'mensal',
          padrao: true,
          ativo: true,
          codigoReferencia: 'UST-19',
          dataAtualizacao: new Date().toISOString(),
          paisAplicacao: 'DE',
          formularioDeclaracao: 'USt-Voranmeldung'
        },
        {
          id: 'impconfig_2',
          tipo: 'gewerbesteuer',
          nome: 'Gewerbesteuer',
          aliquota: 14,
          descricao: 'Imposto comercial para empresas na Alemanha',
          aplicavelEntrada: false,
          aplicavelSaida: true,
          aplicavelEstoque: false,
          periodicidade: 'trimestral',
          padrao: true,
          ativo: true,
          dataAtualizacao: new Date().toISOString(),
          paisAplicacao: 'DE'
        }
      ];
      
      const hoje = new Date();
      const umMesAtras = new Date();
      umMesAtras.setMonth(hoje.getMonth() - 1);
      const proximaSemana = new Date();
      proximaSemana.setDate(hoje.getDate() + 7);
      const umMesDepois = new Date();
      umMesDepois.setMonth(hoje.getMonth() + 1);
      
      const impostosDemo: ImpostoAplicado[] = [
        {
          id: 'impapl_1',
          transacaoId: 'trans_demo_1',
          configId: 'impconfig_1',
          tipo: 'ust',
          nome: 'Umsatzsteuer Jan/2023',
          aliquota: 19,
          baseCalculo: 'total',
          valorBase: 10000,
          valorImposto: 1900,
          pago: true,
          dataVencimento: umMesAtras.toISOString(),
          dataPagamento: umMesAtras.toISOString(),
          documentoReferencia: 'UST-2023-01'
        },
        {
          id: 'impapl_2',
          transacaoId: 'trans_demo_2',
          configId: 'impconfig_1',
          tipo: 'ust',
          nome: 'Umsatzsteuer Fev/2023',
          aliquota: 19,
          baseCalculo: 'total',
          valorBase: 12000,
          valorImposto: 2280,
          pago: false,
          dataVencimento: proximaSemana.toISOString()
        },
        {
          id: 'impapl_3',
          transacaoId: 'trans_demo_3',
          configId: 'impconfig_2',
          tipo: 'gewerbesteuer',
          nome: 'Gewerbesteuer Q1 2023',
          aliquota: 14,
          baseCalculo: 'total',
          valorBase: 30000,
          valorImposto: 4200,
          pago: false,
          dataVencimento: umMesDepois.toISOString()
        },
        {
          id: 'impapl_4',
          transacaoId: 'trans_demo_4',
          configId: 'impconfig_1',
          tipo: 'ust',
          nome: 'Umsatzsteuer Dez/2022',
          aliquota: 19,
          baseCalculo: 'total',
          valorBase: 9500,
          valorImposto: 1805,
          pago: false,
          dataVencimento: umMesAtras.toISOString()
        }
      ];
      
      setConfiguracoes(configsDemo);
      setImpostos(impostosDemo);
      
      localStorage.setItem(STORAGE_KEYS.configuracoes, JSON.stringify(configsDemo));
      localStorage.setItem(STORAGE_KEYS.impostos, JSON.stringify(impostosDemo));
      
      // Calcular resumo com os dados de demonstração
      setTimeout(() => {
        atualizarResumoCalculo();
      }, 500);
    }
    
    // Se não tiver dados carregados, calcular o resumo inicialmente
    if (!storedResumo) {
      atualizarResumoCalculo();
    }
  }, []);

  // Calcular resumo quando houver mudanças nos impostos
  const atualizarResumoCalculo = () => {
    const hoje = new Date();
    const daqui30Dias = new Date();
    daqui30Dias.setDate(hoje.getDate() + 30);
    const daqui60Dias = new Date();
    daqui60Dias.setDate(hoje.getDate() + 60);
    
    // Inicializar valores
    let totalArrecadado = 0;
    let totalPago = 0;
    let totalPendente = 0;
    let proximos30Dias = 0;
    let proximos60Dias = 0;
    let vencidos = 0;
    
    // Mapas para acumular valores por tipo e país
    const valoresPorTipo: Record<string, { arrecadado: number, pago: number, pendente: number }> = {};
    const valoresPorPais: Record<string, { arrecadado: number, pago: number, pendente: number }> = {};
    
    // Processar cada imposto aplicado
    impostos.forEach(imposto => {
      const valor = imposto.valorImposto;
      const config = configuracoes.find(c => c.id === imposto.configId);
      const pais = config?.paisAplicacao || 'desconhecido';
      
      // Inicializar acumuladores se não existirem
      if (!valoresPorTipo[imposto.tipo]) {
        valoresPorTipo[imposto.tipo] = { arrecadado: 0, pago: 0, pendente: 0 };
      }
      if (!valoresPorPais[pais]) {
        valoresPorPais[pais] = { arrecadado: 0, pago: 0, pendente: 0 };
      }
      
      // Verificar se é um imposto de entrada ou saída (simplificado)
      const isEntrada = config?.aplicavelEntrada && !config?.aplicavelSaida;
      
      if (isEntrada) {
        totalArrecadado += valor;
        valoresPorTipo[imposto.tipo].arrecadado += valor;
        valoresPorPais[pais].arrecadado += valor;
      } else {
        if (imposto.pago) {
          totalPago += valor;
          valoresPorTipo[imposto.tipo].pago += valor;
          valoresPorPais[pais].pago += valor;
        } else {
          totalPendente += valor;
          valoresPorTipo[imposto.tipo].pendente += valor;
          valoresPorPais[pais].pendente += valor;
          
          // Verificar vencimentos
          if (imposto.dataVencimento) {
            const dataVencimento = new Date(imposto.dataVencimento);
            if (dataVencimento < hoje) {
              vencidos += valor;
            } else if (dataVencimento <= daqui30Dias) {
              proximos30Dias += valor;
            } else if (dataVencimento <= daqui60Dias) {
              proximos60Dias += valor;
            }
          }
        }
      }
    });
    
    // Criar objeto de resumo atualizado
    const resumoAtualizado: ResumoImpostos = {
      totalArrecadado,
      totalPago,
      totalPendente,
      proximosVencimentos: {
        proximos30Dias,
        proximos60Dias,
        vencidos
      },
      porTipo: valoresPorTipo as any,
      porPais: valoresPorPais,
      ultimaAtualizacao: new Date().toISOString()
    };
    
    setResumo(resumoAtualizado);
    localStorage.setItem(STORAGE_KEYS.resumo, JSON.stringify(resumoAtualizado));
    
    return resumoAtualizado;
  };
  
  // Função pública para atualizar o resumo
  const atualizarResumo = () => {
    return atualizarResumoCalculo();
  };

  // Ações para configurações de impostos
  const adicionarConfiguracao = (config: Omit<ConfiguracaoImposto, 'id' | 'dataAtualizacao'>) => {
    const novaConfiguracao: ConfiguracaoImposto = {
      ...config,
      id: `impconfig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dataAtualizacao: new Date().toISOString()
    };
    
    const novasConfiguracoes = [...configuracoes, novaConfiguracao];
    setConfiguracoes(novasConfiguracoes);
    localStorage.setItem(STORAGE_KEYS.configuracoes, JSON.stringify(novasConfiguracoes));
    
    // Emitir evento
    // @ts-ignore
    EventBus.emit('imposto.novo.registrado', {
      id: novaConfiguracao.id,
      tipo: novaConfiguracao.tipo,
      nome: novaConfiguracao.nome,
      aliquota: novaConfiguracao.aliquota,
      periodicidade: novaConfiguracao.periodicidade,
      paisAplicacao: novaConfiguracao.paisAplicacao,
      dataOcorrencia: new Date().toISOString()
    });
    
    return novaConfiguracao;
  };
  
  const atualizarConfiguracao = (id: string, dados: Partial<Omit<ConfiguracaoImposto, 'id' | 'dataAtualizacao'>>) => {
    const novasConfiguracoes = configuracoes.map(config => {
      if (config.id === id) {
        return {
          ...config,
          ...dados,
          dataAtualizacao: new Date().toISOString()
        };
      }
      return config;
    });
    
    setConfiguracoes(novasConfiguracoes);
    localStorage.setItem(STORAGE_KEYS.configuracoes, JSON.stringify(novasConfiguracoes));
  };
  
  const removerConfiguracao = (id: string) => {
    const novasConfiguracoes = configuracoes.filter(config => config.id !== id);
    setConfiguracoes(novasConfiguracoes);
    localStorage.setItem(STORAGE_KEYS.configuracoes, JSON.stringify(novasConfiguracoes));
  };
  
  const buscarConfiguracao = (id: string) => {
    return configuracoes.find(config => config.id === id);
  };
  
  const listarConfiguracoesPorPais = (pais: string) => {
    return configuracoes.filter(config => config.paisAplicacao === pais);
  };
  
  const listarConfiguracoesPorTipo = (tipo: TipoImposto) => {
    return configuracoes.filter(config => config.tipo === tipo);
  };
  
  // Ações para impostos aplicados
  const registrarImposto = (imposto: Omit<ImpostoAplicado, 'id'>) => {
    const novoImposto: ImpostoAplicado = {
      ...imposto,
      id: `imposto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const novosImpostos = [...impostos, novoImposto];
    setImpostos(novosImpostos);
    localStorage.setItem(STORAGE_KEYS.impostos, JSON.stringify(novosImpostos));
    
    // Atualizar resumo
    atualizarResumoCalculo();
    
    // Verificar e emitir eventos se necessário
    if (!novoImposto.pago && novoImposto.dataVencimento) {
      const hoje = new Date();
      const dataVencimento = new Date(novoImposto.dataVencimento);
      const diferencaDias = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      // Encontrar configuração para obter mais detalhes
      const config = configuracoes.find(c => c.id === novoImposto.configId);
      
      if (diferencaDias <= 7) {
        // Vencimento próximo
        // @ts-ignore
        EventBus.emit('imposto.vencimento.proximo', {
          id: novoImposto.id,
          tipo: novoImposto.tipo,
          nome: novoImposto.nome,
          dataVencimento: novoImposto.dataVencimento,
          diasRestantes: diferencaDias,
          valor: novoImposto.valorImposto,
          paisAplicacao: config?.paisAplicacao || '',
          dataOcorrencia: new Date().toISOString()
        });
      }
    }
    
    return novoImposto;
  };
  
  const atualizarImposto = (id: string, dados: Partial<Omit<ImpostoAplicado, 'id'>>) => {
    const novosImpostos = impostos.map(imposto => {
      if (imposto.id === id) {
        return { ...imposto, ...dados };
      }
      return imposto;
    });
    
    setImpostos(novosImpostos);
    localStorage.setItem(STORAGE_KEYS.impostos, JSON.stringify(novosImpostos));
    
    // Atualizar resumo
    atualizarResumoCalculo();
  };
  
  const removerImposto = (id: string) => {
    const novosImpostos = impostos.filter(imposto => imposto.id !== id);
    setImpostos(novosImpostos);
    localStorage.setItem(STORAGE_KEYS.impostos, JSON.stringify(novosImpostos));
    
    // Atualizar resumo
    atualizarResumoCalculo();
  };
  
  const buscarImposto = (id: string) => {
    return impostos.find(imposto => imposto.id === id);
  };
  
  const listarImpostosPorTransacao = (transacaoId: string) => {
    return impostos.filter(imposto => imposto.transacaoId === transacaoId);
  };
  
  const pagarImposto = (id: string, dataPagamento: string, referencia?: string) => {
    const imposto = impostos.find(imp => imp.id === id);
    if (!imposto) return;
    
    const config = configuracoes.find(c => c.id === imposto.configId);
    
    atualizarImposto(id, { 
      pago: true, 
      dataPagamento, 
      documentoReferencia: referencia || imposto.documentoReferencia 
    });
    
    // Emitir evento
    // @ts-ignore
    EventBus.emit('imposto.pago', {
      id: imposto.id,
      tipo: imposto.tipo,
      nome: imposto.nome,
      valorPago: imposto.valorImposto,
      dataPagamento,
      referencia: referencia || '',
      paisAplicacao: config?.paisAplicacao || '',
      dataOcorrencia: new Date().toISOString()
    });
  };
  
  // Ações para impostos de produtos
  const adicionarImpostoProduto = (imposto: Omit<ImpostoProduto, 'id'>) => {
    const novoImpostoProduto: ImpostoProduto = {
      ...imposto,
      id: `impprod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const novosImpostosProduto = [...produtosImposto, novoImpostoProduto];
    setProdutosImposto(novosImpostosProduto);
    localStorage.setItem(STORAGE_KEYS.produtosImposto, JSON.stringify(novosImpostosProduto));
    
    return novoImpostoProduto;
  };
  
  const atualizarImpostoProduto = (id: string, dados: Partial<Omit<ImpostoProduto, 'id'>>) => {
    const novosImpostosProduto = produtosImposto.map(imposto => {
      if (imposto.id === id) {
        return { ...imposto, ...dados };
      }
      return imposto;
    });
    
    setProdutosImposto(novosImpostosProduto);
    localStorage.setItem(STORAGE_KEYS.produtosImposto, JSON.stringify(novosImpostosProduto));
  };
  
  const removerImpostoProduto = (id: string) => {
    const novosImpostosProduto = produtosImposto.filter(imposto => imposto.id !== id);
    setProdutosImposto(novosImpostosProduto);
    localStorage.setItem(STORAGE_KEYS.produtosImposto, JSON.stringify(novosImpostosProduto));
  };
  
  const buscarImpostoProduto = (produtoId: string, configId: string) => {
    return produtosImposto.find(imposto => 
      imposto.produtoId === produtoId && imposto.configId === configId
    );
  };
  
  const listarImpostosPorProduto = (produtoId: string) => {
    return produtosImposto.filter(imposto => imposto.produtoId === produtoId);
  };
  
  // Cálculos
  const calcularImpostoTransacao = (valorBase: number, aliquotas: number[], tipoBase: 'bruto' | 'liquido' = 'bruto') => {
    let valorBruto = 0;
    let valorLiquido = 0;
    let valorImpostos = 0;
    
    if (tipoBase === 'bruto') {
      valorBruto = valorBase;
      valorImpostos = aliquotas.reduce((acc, aliquota) => {
        return acc + (valorBase * (aliquota / 100));
      }, 0);
      valorLiquido = valorBruto - valorImpostos;
    } else {
      valorLiquido = valorBase;
      // Cálculo reverso para encontrar o valor bruto
      const fatorImposto = aliquotas.reduce((acc, aliquota) => {
        return acc * (1 + aliquota / 100);
      }, 1);
      valorBruto = valorLiquido * fatorImposto;
      valorImpostos = valorBruto - valorLiquido;
    }
    
    return {
      valorBruto: Number(valorBruto.toFixed(2)),
      valorLiquido: Number(valorLiquido.toFixed(2)),
      valorImpostos: Number(valorImpostos.toFixed(2))
    };
  };
  
  const verificarDeclaracoesPendentes = () => {
    const hoje = new Date();
    
    return impostos.filter(imposto => {
      if (imposto.pago) return false;
      
      const config = configuracoes.find(c => c.id === imposto.configId);
      if (!config) return false;
      
      // Verificar baseado na periodicidade
      if (config.periodicidade === 'mensal') {
        // Para impostos mensais, verificar se estamos próximos do final do mês
        const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
        const diasRestantes = ultimoDiaMes - hoje.getDate();
        return diasRestantes <= 7; // Aviso com 7 dias de antecedência
      }
      
      // Para outros casos, usar a data de vencimento
      if (imposto.dataVencimento) {
        const dataVencimento = new Date(imposto.dataVencimento);
        const diferencaDias = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        return diferencaDias >= 0 && diferencaDias <= 7;
      }
      
      return false;
    });
  };
  
  const verificarVencimentosProximos = (diasLimite = 7) => {
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + diasLimite);
    
    return impostos.filter(imposto => {
      if (imposto.pago) return false;
      
      if (imposto.dataVencimento) {
        const dataVencimento = new Date(imposto.dataVencimento);
        return dataVencimento >= hoje && dataVencimento <= limite;
      }
      
      return false;
    });
  };
  
  useEffect(() => {
    // Verificar vencimentos e emitir eventos para o dashboard
    const checkDeclarations = () => {
      const declaracoesPendentes = verificarDeclaracoesPendentes();
      
      declaracoesPendentes.forEach(imposto => {
        const config = configuracoes.find(c => c.id === imposto.configId);
        
        // @ts-ignore
        EventBus.emit('imposto.declaracao.pendente', {
          id: imposto.id,
          tipo: imposto.tipo,
          nome: imposto.nome,
          dataVencimento: imposto.dataVencimento || '',
          diasRestantes: imposto.dataVencimento ? 
            Math.ceil((new Date(imposto.dataVencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
          valor: imposto.valorImposto,
          paisAplicacao: config?.paisAplicacao || '',
          dataOcorrencia: new Date().toISOString()
        });
      });
    };
    
    // Verificar ao iniciar
    checkDeclarations();
    
    // Configurar verificação periódica
    const interval = setInterval(checkDeclarations, 86400000); // Verificar a cada 24h
    
    return () => clearInterval(interval);
  }, [configuracoes, impostos]);
  
  // Valor do contexto
  const contextValue: ImpostosContextData = {
    // Dados
    configuracoes,
    impostos,
    resumo,
    produtosImposto,
    
    // Ações para configurações
    adicionarConfiguracao,
    atualizarConfiguracao,
    removerConfiguracao,
    buscarConfiguracao,
    listarConfiguracoesPorPais,
    listarConfiguracoesPorTipo,
    
    // Ações para impostos aplicados
    registrarImposto,
    atualizarImposto,
    removerImposto,
    buscarImposto,
    listarImpostosPorTransacao,
    pagarImposto,
    
    // Ações para impostos de produtos
    adicionarImpostoProduto,
    atualizarImpostoProduto,
    removerImpostoProduto,
    buscarImpostoProduto,
    listarImpostosPorProduto,
    
    // Cálculos
    calcularImpostoTransacao,
    verificarDeclaracoesPendentes,
    verificarVencimentosProximos,
    
    // Utilitários
    atualizarResumo
  };

  return (
    <ImpostosContext.Provider value={contextValue}>
      {children}
    </ImpostosContext.Provider>
  );
};

// Hook para usar o contexto
export const useImpostos = () => {
  const context = useContext(ImpostosContext);
  if (!context) {
    throw new Error('useImpostos deve ser usado dentro de um ImpostosProvider');
  }
  return context;
}; 