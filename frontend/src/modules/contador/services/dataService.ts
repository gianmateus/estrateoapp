/**
 * Contador (Accountant) data service
 * Provides functions to fetch financial data for the accountant module
 * 
 * Serviço de dados do Contador
 * Fornece funções para buscar dados financeiros para o módulo do contador
 */

import axios from 'axios';
import { 
  EntradaData, 
  SaidaData, 
  FuncionarioData, 
  GraficoDataPoint, 
  ContadorResumoData 
} from '../index';

/**
 * API base URL - should be configured based on environment
 * 
 * URL base da API - deve ser configurada com base no ambiente
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Interface for complete financial data response
 * 
 * Interface para resposta completa de dados financeiros
 */
export interface ContadorData {
  resumo: ContadorResumoData;
  entradas: EntradaData[];
  saidas: SaidaData[];
  funcionarios: FuncionarioData[];
  graficoData: GraficoDataPoint[];
}

/**
 * Get financial data for a specific month
 * @param mes Month in YYYY-MM format
 * @returns Promise with financial data
 * 
 * Obtém dados financeiros para um mês específico
 * @param mes Mês no formato AAAA-MM
 * @returns Promise com dados financeiros
 */
export const getContadorData = async (mes: string): Promise<ContadorData> => {
  try {
    // In a real implementation, this would call the backend API
    // Em uma implementação real, isso chamaria a API do backend
    
    // const response = await axios.get(`${API_BASE_URL}/contador/dados/${mes}`);
    // return response.data;
    
    // For demo purposes, return mock data
    // Para fins de demonstração, retornar dados mockados
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo data
    return {
      resumo: {
        receita: 8750.50,
        despesas: 6240.75,
        saldo: 2509.75,
        funcionariosPagos: 5
      },
      entradas: [
        { id: 1, data: '2025-04-02', cliente: 'Restaurante Silva', descricao: 'Venda mensal', valor: 2300.50 },
        { id: 2, data: '2025-04-10', cliente: 'Café Central', descricao: 'Consultoria', valor: 1500.00 },
        { id: 3, data: '2025-04-15', cliente: 'Pizzaria Napoli', descricao: 'Treinamento', valor: 2800.00 },
        { id: 4, data: '2025-04-22', cliente: 'Bar do João', descricao: 'Serviços extras', valor: 950.00 },
        { id: 5, data: '2025-04-28', cliente: 'Lanchonete Boa Vista', descricao: 'Implementação', valor: 1200.00 }
      ],
      saidas: [
        { id: 1, data: '2025-04-05', fornecedor: 'Aluguel', tipo: 'Infraestrutura', valor: 1800.00 },
        { id: 2, data: '2025-04-08', fornecedor: 'Luz e Água', tipo: 'Utilidades', valor: 450.75 },
        { id: 3, data: '2025-04-12', fornecedor: 'Materiais de Escritório', tipo: 'Suprimentos', valor: 320.00 },
        { id: 4, data: '2025-04-20', fornecedor: 'Marketing Digital', tipo: 'Publicidade', valor: 680.00 },
        { id: 5, data: '2025-04-25', fornecedor: 'Manutenção', tipo: 'Serviços', valor: 290.00 },
        { id: 6, data: '2025-04-30', fornecedor: 'Folha de Pagamento', tipo: 'Pessoal', valor: 2700.00 }
      ],
      funcionarios: [
        { id: 1, nome: 'Ana Silva', tipoContrato: 'CLT', horasTrabalhadas: 160, valorPago: 1800.00 },
        { id: 2, nome: 'Carlos Mendes', tipoContrato: 'PJ', horasTrabalhadas: 120, valorPago: 2400.00 },
        { id: 3, nome: 'Mariana Costa', tipoContrato: 'CLT', horasTrabalhadas: 160, valorPago: 1600.00 },
        { id: 4, nome: 'Paulo Santos', tipoContrato: 'Estagiário', horasTrabalhadas: 120, valorPago: 800.00 },
        { id: 5, nome: 'Juliana Ferreira', tipoContrato: 'Terceirizado', horasTrabalhadas: 80, valorPago: 1200.00 }
      ],
      graficoData: [
        { dia: '01/04', receitas: 350, despesas: 280 },
        { dia: '08/04', receitas: 450, despesas: 320 },
        { dia: '15/04', receitas: 550, despesas: 450 },
        { dia: '22/04', receitas: 650, despesas: 400 },
        { dia: '29/04', receitas: 600, despesas: 350 },
      ]
    };
  } catch (error) {
    console.error('Erro ao buscar dados do contador:', error);
    throw error;
  }
};

export default {
  getContadorData,
}; 