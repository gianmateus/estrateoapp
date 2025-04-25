/**
 * Contador (Accountant) Module - exports for components and services
 * Makes components available for import from frontend/src/modules/contador
 * 
 * Módulo do Contador - exportações para componentes e serviços
 * Torna os componentes disponíveis para importação de frontend/src/modules/contador
 */

// Export main page
// Exporta a página principal
export { default as ContadorPage } from '../../pages/Contador';

// Export components
// Exporta os componentes
export { default as ResumoMensalCard } from '../../components/contador/ResumoMensalCard';
export { default as GraficoReceitasDespesas } from '../../components/contador/GraficoReceitasDespesas';
export { default as TabelaEntradas } from '../../components/contador/TabelaEntradas';
export { default as TabelaSaidas } from '../../components/contador/TabelaSaidas';
export { default as TabelaFuncionarios } from '../../components/contador/TabelaFuncionarios';
export { default as BotaoGerarRelatorio } from '../../components/contador/BotaoGerarRelatorio';

// Types that can be reused
// Tipos que podem ser reutilizados
export interface EntradaData {
  id: number;
  data: string;
  cliente: string;
  descricao: string;
  valor: number;
}

export interface SaidaData {
  id: number;
  data: string;
  fornecedor: string;
  tipo: string;
  valor: number;
}

export interface FuncionarioData {
  id: number;
  nome: string;
  tipoContrato: string;
  horasTrabalhadas: number;
  valorPago: number;
}

export interface GraficoDataPoint {
  dia: string;
  receitas: number;
  despesas: number;
}

export interface ContadorResumoData {
  receita: number;
  despesas: number;
  saldo: number;
  funcionariosPagos: number;
}

/**
 * Helper function to format currency in Euro format
 * @param value Number to format
 * @returns Formatted string
 * 
 * Função auxiliar para formatar moeda no formato Euro
 * @param value Número a formatar
 * @returns String formatada
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}; 