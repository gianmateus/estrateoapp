import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Interfaces
export interface Transacao {
  id: string;
  data: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  descricao: string;
  metodoPagamento?: string;
  observacao?: string;
}

export interface BalancoFinanceiro {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
  ultimaAtualizacao: string;
}

interface FinanceiroContextType {
  transacoes: Transacao[];
  balanco: BalancoFinanceiro;
  adicionarTransacao: (transacao: Omit<Transacao, 'id'>) => void;
  removerTransacao: (id: string) => void;
  editarTransacao: (id: string, transacao: Omit<Transacao, 'id'>) => void;
  carregarDados: () => void;
}

// Chaves para armazenamento no localStorage
const STORAGE_KEYS = {
  transacoes: 'financeiro_transacoes',
  balanco: 'financeiro_balanco'
};

// Valores iniciais
const balancoInicial: BalancoFinanceiro = {
  saldoAtual: 0,
  totalEntradas: 0,
  totalSaidas: 0,
  ultimaAtualizacao: new Date().toISOString()
};

// Criação do contexto
const FinanceiroContext = createContext<FinanceiroContextType>({} as FinanceiroContextType);

// Hook para usar o contexto
export const useFinanceiro = () => useContext(FinanceiroContext);

interface FinanceiroProviderProps {
  children: ReactNode;
}

export const FinanceiroProvider: React.FC<FinanceiroProviderProps> = ({ children }) => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [balanco, setBalanco] = useState<BalancoFinanceiro>(balancoInicial);

  // Função para calcular o balanço com base nas transações
  const calcularBalanco = (transacoes: Transacao[]): BalancoFinanceiro => {
    let totalEntradas = 0;
    let totalSaidas = 0;

    transacoes.forEach(transacao => {
      if (transacao.tipo === 'entrada') {
        totalEntradas += transacao.valor;
      } else {
        totalSaidas += transacao.valor;
      }
    });

    return {
      saldoAtual: totalEntradas - totalSaidas,
      totalEntradas,
      totalSaidas,
      ultimaAtualizacao: new Date().toISOString()
    };
  };

  // Função para carregar os dados do localStorage
  const carregarDados = () => {
    try {
      // Carregar transações
      const transacoesStr = localStorage.getItem(STORAGE_KEYS.transacoes);
      if (transacoesStr) {
        const transacoesCarregadas = JSON.parse(transacoesStr);
        setTransacoes(transacoesCarregadas);

        // Recalcular balanço com base nas transações carregadas
        const novoBalanco = calcularBalanco(transacoesCarregadas);
        setBalanco(novoBalanco);
        localStorage.setItem(STORAGE_KEYS.balanco, JSON.stringify(novoBalanco));
      } else {
        // Se não houver transações, definir balanço inicial
        localStorage.setItem(STORAGE_KEYS.balanco, JSON.stringify(balancoInicial));
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    }
  };

  // Carregar dados ao inicializar o componente
  useEffect(() => {
    carregarDados();
  }, []);

  // Função para adicionar uma nova transação
  const adicionarTransacao = (novaTransacao: Omit<Transacao, 'id'>) => {
    const transacao: Transacao = {
      ...novaTransacao,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const novasTransacoes = [...transacoes, transacao];
    setTransacoes(novasTransacoes);

    // Atualizar balanço
    const novoBalanco = calcularBalanco(novasTransacoes);
    setBalanco(novoBalanco);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.transacoes, JSON.stringify(novasTransacoes));
    localStorage.setItem(STORAGE_KEYS.balanco, JSON.stringify(novoBalanco));
  };

  // Função para remover uma transação
  const removerTransacao = (id: string) => {
    const novasTransacoes = transacoes.filter(t => t.id !== id);
    setTransacoes(novasTransacoes);

    // Atualizar balanço
    const novoBalanco = calcularBalanco(novasTransacoes);
    setBalanco(novoBalanco);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.transacoes, JSON.stringify(novasTransacoes));
    localStorage.setItem(STORAGE_KEYS.balanco, JSON.stringify(novoBalanco));
  };

  // Função para editar uma transação existente
  const editarTransacao = (id: string, transacaoAtualizada: Omit<Transacao, 'id'>) => {
    const novasTransacoes = transacoes.map(t => 
      t.id === id 
        ? { ...transacaoAtualizada, id } 
        : t
    );
    
    setTransacoes(novasTransacoes);

    // Atualizar balanço
    const novoBalanco = calcularBalanco(novasTransacoes);
    setBalanco(novoBalanco);

    // Persistir no localStorage
    localStorage.setItem(STORAGE_KEYS.transacoes, JSON.stringify(novasTransacoes));
    localStorage.setItem(STORAGE_KEYS.balanco, JSON.stringify(novoBalanco));
  };

  return (
    <FinanceiroContext.Provider 
      value={{
        transacoes,
        balanco,
        adicionarTransacao,
        removerTransacao,
        editarTransacao,
        carregarDados
      }}
    >
      {children}
    </FinanceiroContext.Provider>
  );
};

export default FinanceiroContext; 