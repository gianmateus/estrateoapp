/**
 * Interface para os dados coletados do usuário para geração de recomendações
 */
export interface DadosUsuario {
  userId: string;
  saldoAtual: number;
  entradasSemana: number;
  saidasSemana: number;
  itensEstoqueCritico: string[];
  contasAVencer: {
    id: string;
    descricao: string;
    valor: number;
    dataVencimento: string;
  }[];
  relatorioMensalGerado: boolean;
}

/**
 * Interface para as mensagens geradas pela IA
 */
export interface IAMensagem {
  id: string;
  userId: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  acao?: string;
}

/**
 * Tipo para as recomendações da API
 */
export type Recomendacao = {
  texto: string;
  tipo: 'financeiro' | 'estoque' | 'relatorio' | 'outro';
  acao?: string;
}; 