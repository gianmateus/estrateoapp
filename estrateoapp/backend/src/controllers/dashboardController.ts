import { Request, Response } from 'express';
import prisma from '../lib/prisma';

/**
 * Controller for dashboard operations
 * Provides summarized data for the dashboard view
 * 
 * Controlador para operações do dashboard
 * Fornece dados resumidos para a visualização do painel
 */
const dashboardController = {
  /**
   * Get dashboard data with mocked/simulated values
   * Returns financial, inventory and user statistics
   * 
   * Obter dados do dashboard com valores simulados
   * Retorna estatísticas financeiras, de inventário e de usuários
   * 
   * @param req - Express request object
   * @param res - Express response object
   */
  getDashboardData: async (req: Request, res: Response) => {
    try {
      // Get authenticated user ID from the request
      // Obter ID do usuário autenticado da requisição
      const userId = req.user.id;
      
      // Mock financial summary data
      // Dados simulados de resumo financeiro
      const financialSummary = {
        totalEntradas: 15800.50,     // Total income | Total de entradas
        totalSaidas: 9450.75,        // Total expenses | Total de saídas
        saldoAtual: 6349.75,         // Current balance | Saldo atual
        entradasHoje: 1250.00,       // Today's income | Entradas hoje
        saidasHoje: 580.25,          // Today's expenses | Saídas hoje
        movimentacoesRecentes: [     // Recent transactions | Transações recentes
          {
            id: '1',
            descricao: 'Venda do dia',
            valor: 1250.00,
            tipo: 'entrada',
            data: new Date().toISOString()
          },
          {
            id: '2',
            descricao: 'Pagamento fornecedor',
            valor: 580.25,
            tipo: 'saida',
            data: new Date().toISOString()
          },
          {
            id: '3',
            descricao: 'Venda delivery',
            valor: 125.50,
            tipo: 'entrada',
            data: new Date(Date.now() - 86400000).toISOString() // Yesterday
          }
        ]
      };
      
      // Mock inventory summary data
      // Dados simulados de resumo de inventário
      const inventorySummary = {
        totalItens: 125,              // Total items | Total de itens
        valorTotal: 8750.50,          // Total value | Valor total
        itensAbaixoMinimo: 7,         // Items below minimum | Itens abaixo do mínimo
        itensCriticos: [              // Critical items | Itens críticos
          {
            id: '1',
            nome: 'Batata',
            quantidadeAtual: 5,
            quantidadeMinima: 10,
            unidade: 'kg'
          },
          {
            id: '2',
            nome: 'Óleo de cozinha',
            quantidadeAtual: 2,
            quantidadeMinima: 5,
            unidade: 'L'
          },
          {
            id: '3',
            nome: 'Carne moída',
            quantidadeAtual: 3,
            quantidadeMinima: 8,
            unidade: 'kg'
          }
        ]
      };
      
      // Mock usage statistics
      // Estatísticas simuladas de uso
      const usageStats = {
        totalUsuarios: 5,              // Total users | Total de usuários
        totalTransacoes: 187,          // Total transactions | Total de transações
        mediaDiaria: 22.5              // Daily average | Média diária
      };
      
      // Mock AI recommendations
      // Recomendações simuladas de IA
      const aiRecommendations = [
        'Seu estoque de batatas está abaixo do mínimo, considere reabastecer',
        'As vendas tendem a aumentar 20% nos finais de semana, prepare seu estoque',
        'Seus gastos com fornecedores aumentaram 15% este mês'
      ];
      
      // Return combined dashboard data
      // Retornar dados combinados do dashboard
      return res.status(200).json({
        financeiro: financialSummary,
        inventario: inventorySummary,
        estatisticas: usageStats,
        recomendacoesIA: aiRecommendations,
        success: true
      });
      
    } catch (error: any) {
      console.error('Erro ao obter dados do dashboard:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao carregar dados do dashboard',
        details: error.message
      });
    }
  }
};

export default dashboardController; 