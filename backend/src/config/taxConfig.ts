/**
 * Configuração do módulo de cálculo de impostos
 */

export type EmpresaTipo = 'GmbH' | 'UG' | 'Freelancer' | 'Kleinunternehmer';

interface TaxConfigInterface {
  tipoEmpresa: EmpresaTipo;
  vatRate: number; // Taxa de VAT (19% ou 7% dependendo do tipo de produto/serviço)
  tradeTaxMultiplier: number; // Multiplicador do imposto comercial (varia por região)
  isSmallBusiness: boolean; // Se está no regime de pequena empresa (§19)
  corpTaxRate: number; // Taxa de imposto corporativo
  solidarityRate: number; // Taxa de solidariedade
  payrollBaseRate: number; // Taxa base para impostos sobre folha de pagamento
}

// Configuração padrão para uma empresa tipo GmbH na Alemanha
const taxConfig: TaxConfigInterface = {
  tipoEmpresa: 'GmbH',
  vatRate: 19, // 19% é a taxa padrão, 7% para alguns produtos essenciais
  tradeTaxMultiplier: 3.5, // Valor médio, varia por município entre ~3.15% e 4.2%
  isSmallBusiness: false, // Por padrão, GmbH não é enquadrada no §19
  corpTaxRate: 15, // Taxa padrão de imposto corporativo
  solidarityRate: 5.5, // Taxa de solidariedade
  payrollBaseRate: 20, // Aproximação para encargos sociais (pode variar)
};

export default taxConfig; 