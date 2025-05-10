export enum TaxType {
  VAT_OUTPUT = 'VAT_OUTPUT',
  VAT_INPUT = 'VAT_INPUT',
  CIT_PREPAY = 'CIT_PREPAY',
  CIT_FINAL = 'CIT_FINAL',
  TRADE_PREPAY = 'TRADE_PREPAY',
  TRADE_FINAL = 'TRADE_FINAL',
  LOHNSTEUER = 'LOHNSTEUER',
  SOLI = 'SOLI',
  SV_EMPLOYER = 'SV_EMPLOYER',
  KAPITALERTRAG = 'KAPITALERTRAG'
}

export enum PeriodicidadeImposto {
  MENSAL = 'MENSAL',
  TRIMESTRAL = 'TRIMESTRAL',
  ANUAL = 'ANUAL',
  AD_HOC = 'AD_HOC'
}

export interface TaxLedgerEntry {
  id: string;
  companyId: string;
  period: string; // formato 'YYYY-MM'
  taxType: TaxType;
  amount: number;
  currency: string;
  updatedAt: string;
  dueDate?: string;
  isPaid?: boolean;
}

export interface TaxSummary {
  [TaxType.VAT_OUTPUT]?: number;
  [TaxType.VAT_INPUT]?: number;
  [TaxType.CIT_PREPAY]?: number;
  [TaxType.CIT_FINAL]?: number;
  [TaxType.TRADE_PREPAY]?: number;
  [TaxType.TRADE_FINAL]?: number;
  [TaxType.LOHNSTEUER]?: number;
  [TaxType.SOLI]?: number;
  [TaxType.SV_EMPLOYER]?: number;
  [TaxType.KAPITALERTRAG]?: number;
  period: string;
}

// Compatibilidade com a interface atual
export interface TaxForecastData {
  mes: string;
  vatPayable: number;
  tradeTax: number;
  corpTax: number;
  payrollTax: number;
  vatInput?: number;
  vatOutput?: number;
}

export interface TaxDetailProps {
  companyId: string;
  period: string;
  taxType: TaxType;
}

export interface TaxStatusProps {
  dueDate: Date | string;
  isPaid?: boolean;
}

export enum TaxStatus {
  PAID = 'PAID',
  DUE = 'DUE',
  OVERDUE = 'OVERDUE',
  UPCOMING = 'UPCOMING'
} 