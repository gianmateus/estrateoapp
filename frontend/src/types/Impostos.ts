/**
 * Tipos e interfaces para o sistema de gestão de impostos
 * @module Impostos
 */

/**
 * Tipos de impostos suportados pelo sistema
 */
export type TipoImposto = 
  | 'ust'              // Umsatzsteuer (VAT/IVA)
  | 'gewerbesteuer'    // Imposto sobre atividade empresarial
  | 'soli'             // Solidaritätszuschlag (Sobretaxa de solidariedade)
  | 'kirchensteuer'    // Imposto eclesiástico
  | 'sozialabgaben'    // Encargos sociais
  | 'einkommensteuer'  // Imposto de renda
  | 'grundsteuer'      // Imposto sobre propriedade
  | 'kapitalertragsteuer' // Imposto sobre ganhos de capital
  | 'importacao'       // Impostos de importação
  | 'taxa_fixa'        // Taxas fixas (bancárias, administrativas, etc.)
  | 'outro';           // Outros tipos de impostos

/**
 * Base de cálculo para aplicação de impostos
 */
export type BaseCalculo = 
  | 'total'            // Aplicado sobre o valor total
  | 'parcial'          // Aplicado sobre parte do valor
  | 'isento';          // Isento de imposto

/**
 * Periodicidade para declaração/pagamento de impostos
 */
export type PeriodicidadeImposto =
  | 'mensal'           // Mensal (ex: USt-Voranmeldung)
  | 'trimestral'       // Trimestral
  | 'semestral'        // Semestral
  | 'anual'            // Anual (ex: declaração anual de imposto)
  | 'unica';           // Pagamento único

/**
 * Categorias fiscais para produtos na UE
 */
export type CategoriaFiscalProduto =
  | 'padrao'           // Alíquota padrão
  | 'reduzida'         // Alíquota reduzida
  | 'superreduzida'    // Alíquota super-reduzida (alguns países)
  | 'isenta'           // Isenta de impostos
  | 'especial';        // Regime especial

/**
 * Interface para configuração de imposto
 */
export interface ConfiguracaoImposto {
  id: string;
  tipo: TipoImposto;
  nome: string;                  // Nome exibido na interface
  aliquota: number;              // Valor percentual (ex: 19 para 19%)
  descricao?: string;            // Descrição detalhada
  aplicavelEntrada: boolean;     // Se aplicável a entradas/receitas
  aplicavelSaida: boolean;       // Se aplicável a saídas/despesas
  aplicavelEstoque: boolean;     // Se aplicável a itens de estoque
  periodicidade: PeriodicidadeImposto; // Periodicidade de pagamento/declaração
  padrao: boolean;               // Se é imposto padrão para cálculos
  ativo: boolean;                // Se está ativo no sistema
  codigoReferencia?: string;     // Código de referência para relatórios
  dataAtualizacao: string;       // Data da última atualização
  paisAplicacao: string;         // País onde se aplica este imposto
  formularioDeclaracao?: string; // Formulário usado para declaração (ex: "USt-Voranmeldung")
}

/**
 * Interface para detalhe de imposto aplicado em uma transação
 */
export interface ImpostoAplicado {
  id: string;
  transacaoId: string;           // ID da transação (entrada, saída ou movimentação)
  configId: string;              // ID da configuração do imposto
  tipo: TipoImposto;             // Tipo do imposto
  nome: string;                  // Nome do imposto
  aliquota: number;              // Percentual aplicado
  baseCalculo: BaseCalculo;      // Base de cálculo
  valorBase: number;             // Valor base para cálculo
  valorImposto: number;          // Valor calculado do imposto
  pago: boolean;                 // Se já foi pago
  dataVencimento?: string;       // Data de vencimento, se aplicável
  dataPagamento?: string;        // Data em que foi pago, se aplicável
  documentoReferencia?: string;  // Referência a documento fiscal
  numeroDeclaracao?: string;     // Número do documento de declaração fiscal
  observacao?: string;           // Observações adicionais
}

/**
 * Interface para impostos aplicados a produtos
 */
export interface ImpostoProduto {
  id: string;
  produtoId: string;             // ID do produto no estoque
  configId: string;              // ID da configuração do imposto
  categoriaFiscal: CategoriaFiscalProduto; // Categoria fiscal do produto
  aliquota: number;              // Alíquota específica para este produto
  codigoNCM?: string;            // Nomenclatura Comum do Mercosul (para BR)
  codigoTaric?: string;          // Código TARIC (para UE)
  isento: boolean;               // Se o produto é isento deste imposto
  observacao?: string;           // Observações adicionais
}

/**
 * Interface para resumo de impostos
 */
export interface ResumoImpostos {
  totalArrecadado: number;       // Total de impostos em entradas
  totalPago: number;             // Total de impostos em saídas
  totalPendente: number;         // Total de impostos a pagar
  proximosVencimentos: {         // Impostos com vencimento próximo
    proximos30Dias: number;
    proximos60Dias: number;
    vencidos: number;
  };
  porTipo: {                     // Distribuição por tipo de imposto
    [key in TipoImposto]?: {
      arrecadado: number;
      pago: number;
      pendente: number;
    };
  };
  porPais: {                     // Distribuição por país
    [pais: string]: {
      arrecadado: number;
      pago: number;
      pendente: number;
    };
  };
  ultimaAtualizacao: string;     // Data da última atualização
}

/**
 * Interface para pesquisa e filtros de impostos
 */
export interface FiltroImpostos {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoImposto[];
  pago?: boolean;
  vencidos?: boolean;
  proximosVencimentos?: boolean;
  pais?: string[];
  periodicidade?: PeriodicidadeImposto[];
} 