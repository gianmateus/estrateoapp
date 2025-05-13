/**
 * Utilitários para cálculos fiscais alemães e europeus
 * 
 * Implementa cálculos para:
 * - Mehrwertsteuer (VAT): 19% padrão, 7% reduzida
 * - Gewerbesteuer (Imposto Comercial Municipal) 
 * - Einkommensteuer (Imposto de Renda)
 * - Körperschaftsteuer (Imposto Corporativo)
 * - Solidaritätszuschlag (Taxa de Solidariedade)
 * 
 * Estes cálculos são baseados nas regras fiscais alemãs.
 */

import { ContadorData } from '../services/dataService';

// Alíquotas padrão de impostos na Alemanha
const TAXAS = {
  MEHRWERTSTEUER_NORMAL: 0.19, // 19%
  MEHRWERTSTEUER_REDUZIDA: 0.07, // 7%
  GEWERBESTEUER_BASE: 0.035, // 3.5% (multiplicado pelo multiplicador municipal, típico entre 200% e 550%)
  MUNICIPIO_MULTIPLICADOR: 4.0, // Exemplo: Berlim (400%)
  KOERPERSCHAFTSTEUER: 0.15, // 15%
  SOLIDARITAETSZUSCHLAG: 0.055, // 5.5% do imposto corporativo
};

// Interface para o resultado dos cálculos fiscais
interface ImpostosAlemanha {
  mehrwertsteuer: {
    normal: number;
    reduzido: number;
    total: number;
  };
  gewerbesteuer: number;
  einkommensteuer: number;
  koerperschaftsteuer: number;
  solidaritaetszuschlag: number;
}

/**
 * Calcula o Mehrwertsteuer (Imposto sobre Valor Agregado - VAT) para dados financeiros
 * 
 * @param receita Valor total de receitas
 * @param proporcaoNormal Proporção de vendas com alíquota normal (0-1)
 * @returns Detalhamento do Mehrwertsteuer
 */
export function calcularMehrwertsteuer(receita: number, proporcaoNormal: number = 0.8) {
  // Garantir que a proporção esteja entre 0 e 1
  proporcaoNormal = Math.max(0, Math.min(1, proporcaoNormal));
  
  // Calcular receitas para cada alíquota
  const receitaNormal = receita * proporcaoNormal;
  const receitaReduzida = receita * (1 - proporcaoNormal);
  
  // Calcular VAT para cada alíquota
  const vatNormal = receitaNormal * TAXAS.MEHRWERTSTEUER_NORMAL;
  const vatReduzida = receitaReduzida * TAXAS.MEHRWERTSTEUER_REDUZIDA;
  
  return {
    normal: vatNormal,
    reduzido: vatReduzida,
    total: vatNormal + vatReduzida
  };
}

/**
 * Calcula o Gewerbesteuer (Imposto Comercial Municipal)
 * 
 * @param lucro Valor do lucro operacional
 * @param multiplicadorMunicipal Multiplicador específico do município (tipicamente entre 2-5.5)
 * @returns Valor do Gewerbesteuer
 */
export function calcularGewerbesteuer(lucro: number, multiplicadorMunicipal: number = TAXAS.MUNICIPIO_MULTIPLICADOR) {
  // Taxa base é multiplicada pelo multiplicador municipal
  const taxaEfetiva = TAXAS.GEWERBESTEUER_BASE * multiplicadorMunicipal;
  
  return Math.max(0, lucro * taxaEfetiva);
}

/**
 * Calcula o Körperschaftsteuer (Imposto Corporativo) e o Solidaritätszuschlag (Taxa de Solidariedade)
 * 
 * @param lucro Valor do lucro tributável
 * @returns Objeto com valores dos impostos
 */
export function calcularImpostosCorporativos(lucro: number) {
  // Körperschaftsteuer - imposto corporativo fixo de 15%
  const koerperschaftsteuer = Math.max(0, lucro * TAXAS.KOERPERSCHAFTSTEUER);
  
  // Solidaritätszuschlag - 5.5% sobre o Körperschaftsteuer
  const solidaritaetszuschlag = koerperschaftsteuer * TAXAS.SOLIDARITAETSZUSCHLAG;
  
  return {
    koerperschaftsteuer,
    solidaritaetszuschlag
  };
}

/**
 * Calcula o Einkommensteuer (Imposto de Renda) para pessoas físicas
 * Esta implementação é simplificada
 * 
 * @param rendimento Rendimento anual em EUR
 * @returns Valor estimado do imposto de renda
 */
export function calcularEinkommensteuer(rendimento: number) {
  // Lógica simplificada do imposto de renda alemão
  // Base: 2022 progressive tax rates
  let imposto = 0;
  
  if (rendimento <= 9744) {
    // Isento
    imposto = 0;
  } else if (rendimento <= 57918) {
    // Primeira faixa: 14% a 42% progressivo
    imposto = rendimento * 0.25; // Simplificação
  } else if (rendimento <= 274613) {
    // Segunda faixa: 42%
    imposto = rendimento * 0.42;
  } else {
    // Terceira faixa: 45%
    imposto = rendimento * 0.45;
  }
  
  return imposto;
}

/**
 * Calcula todos os impostos relevantes para uma empresa na Alemanha
 * 
 * @param dados Dados financeiros da empresa
 * @returns Objeto com detalhamento de todos os impostos
 */
export function calcularImpostosAlemanha(dados: ContadorData): ImpostosAlemanha {
  const receita = dados.resumo.receita;
  const despesas = dados.resumo.despesas;
  const lucro = receita - despesas;
  
  // 1. Calcular Mehrwertsteuer (VAT)
  const mehrwertsteuer = calcularMehrwertsteuer(receita);
  
  // 2. Calcular Gewerbesteuer (Imposto Comercial)
  const gewerbesteuer = calcularGewerbesteuer(lucro);
  
  // 3. Calcular Körperschaftsteuer e Solidaritätszuschlag
  const { koerperschaftsteuer, solidaritaetszuschlag } = calcularImpostosCorporativos(lucro);
  
  // 4. Calcular Einkommensteuer (simplificado)
  // Assumimos que 50% do lucro é distribuído para pessoa física
  const rendimentoPessoal = lucro * 0.5;
  const einkommensteuer = calcularEinkommensteuer(rendimentoPessoal);
  
  return {
    mehrwertsteuer,
    gewerbesteuer,
    einkommensteuer,
    koerperschaftsteuer,
    solidaritaetszuschlag
  };
}

/**
 * Formata um valor monetário no padrão alemão/europeu
 * 
 * @param valor Valor a ser formatado
 * @returns String formatada (€X.XXX,XX)
 */
export function formatarMoedaEuropeia(valor: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Exporta os dados financeiros no formato XBRL
 * (Implementação simulada para demonstração)
 * 
 * @param dados Dados financeiros
 * @returns String com representação XBRL dos dados
 */
export function gerarXBRL(dados: ContadorData): string {
  // Simulação de geração XBRL
  const xbrlTemplate = `
    <xbrl xmlns="http://www.xbrl.org/2003/instance">
      <context id="CurrentPeriod">
        <period>
          <startDate>${dados.entradas[0]?.data || '2023-01-01'}</startDate>
          <endDate>${dados.entradas[dados.entradas.length-1]?.data || '2023-12-31'}</endDate>
        </period>
        <entity>
          <identifier scheme="http://www.statistik.gv.at">EMPRESA_ID</identifier>
        </entity>
      </context>
      
      <unit id="EUR">
        <measure>iso4217:EUR</measure>
      </unit>
      
      <dei:Revenue contextRef="CurrentPeriod" unitRef="EUR" decimals="2">${dados.resumo.receita}</dei:Revenue>
      <dei:Expenses contextRef="CurrentPeriod" unitRef="EUR" decimals="2">${dados.resumo.despesas}</dei:Expenses>
      <dei:NetIncome contextRef="CurrentPeriod" unitRef="EUR" decimals="2">${dados.resumo.saldo}</dei:NetIncome>
    </xbrl>
  `;
  
  return xbrlTemplate;
}

export default {
  calcularMehrwertsteuer,
  calcularGewerbesteuer,
  calcularImpostosCorporativos,
  calcularEinkommensteuer,
  calcularImpostosAlemanha,
  formatarMoedaEuropeia,
  gerarXBRL
}; 