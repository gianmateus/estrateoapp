/**
 * Serviço para obtenção de dados consolidados para relatórios internos
 * Versão simulada para desenvolvimento
 */
import { startOfMonth, endOfMonth } from 'date-fns';

// Interfaces para os dados do relatório
interface Funcionario {
  nome: string;
  horasSemanais: number;
  salarioBruto: number;
}

interface ProdutoEstoque {
  nome: string;
  quantidade: number;
  movimentacao: number;
  abaixoMinimo: boolean;
}

interface DadosFinanceiros {
  totalEntradas: number;
  totalSaidas: number;
}

interface DadosImpostos {
  vatPercentual: number;
  vatValor: number;
  gewerbesteuerValor: number;
}

interface DadosRelatorio {
  nomeEmpresa: string;
  financeiro: DadosFinanceiros;
  funcionarios: Funcionario[];
  estoque: ProdutoEstoque[];
  impostos: DadosImpostos;
}

class ContadorRelatorioInternoService {
  /**
   * Obtém dados consolidados para o relatório mensal interno
   * Versão simulada para desenvolvimento
   * 
   * @param userId ID do usuário
   * @param mes Mês no formato YYYY-MM
   * @returns Dados compilados de diferentes módulos
   */
  async getDadosRelatorio(userId: string, mes: string): Promise<DadosRelatorio> {
    try {
      // Parsear o mês para obter o intervalo de datas
      const [ano, mesNum] = mes.split('-');
      const dataInicio = startOfMonth(new Date(Number(ano), Number(mesNum) - 1));
      const dataFim = endOfMonth(new Date(Number(ano), Number(mesNum) - 1));
      
      // ---- DADOS SIMULADOS PARA DESENVOLVIMENTO ----
      
      // Dados financeiros simulados
      const totalEntradas = 15680.45;
      const totalSaidas = 9785.30;
      
      // Funcionários simulados
      const funcionarios: Funcionario[] = [
        { nome: 'Maria Silva', horasSemanais: 40, salarioBruto: 3500 },
        { nome: 'João Santos', horasSemanais: 20, salarioBruto: 1800 },
        { nome: 'Anna Schmidt', horasSemanais: 40, salarioBruto: 4200 }
      ];
      
      // Produtos simulados
      const produtos: ProdutoEstoque[] = [
        { nome: 'Produto A', quantidade: 45, movimentacao: 12, abaixoMinimo: false },
        { nome: 'Produto B', quantidade: 5, movimentacao: -3, abaixoMinimo: true },
        { nome: 'Produto C', quantidade: 78, movimentacao: 25, abaixoMinimo: false },
        { nome: 'Produto D', quantidade: 2, movimentacao: -8, abaixoMinimo: true }
      ];
      
      // Cálculos de impostos simulados
      const vatPercentual = 19;
      const vatValor = totalEntradas * (vatPercentual / 100);
      const lucro = totalEntradas - totalSaidas;
      const gewerbesteuerValor = lucro > 0 ? lucro * 0.15 : 0;
      
      // Montar objeto de resposta com dados simulados
      return {
        nomeEmpresa: 'Estrateo GmbH',
        financeiro: {
          totalEntradas,
          totalSaidas
        },
        funcionarios,
        estoque: produtos,
        impostos: {
          vatPercentual,
          vatValor,
          gewerbesteuerValor
        }
      };
    } catch (error) {
      console.error('Erro ao buscar dados para relatório:', error);
      throw new Error('Falha ao obter dados para o relatório');
    }
  }
}

export default ContadorRelatorioInternoService; 