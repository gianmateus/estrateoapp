/**
 * Service for the Contador (Accountant) module
 * Handles business logic for financial data and PDF report generation
 * 
 * Serviço para o módulo Contador
 * Gerencia lógica de negócios para dados financeiros e geração de relatórios PDF
 */
import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { Stream } from 'stream';

const prisma = new PrismaClient();

/**
 * Interface for monthly financial data summary
 * 
 * Interface para resumo de dados financeiros mensais
 */
interface ResumoFinanceiro {
  receita: number;
  despesas: number;
  saldo: number;
  funcionariosPagos: number;
}

/**
 * Interface for chart data points
 * 
 * Interface para pontos de dados do gráfico
 */
interface GraficoDataPoint {
  dia: string;
  receitas: number;
  despesas: number;
}

/**
 * Interface for complete financial data
 * 
 * Interface para dados financeiros completos
 */
interface DadosFinanceiros {
  resumo: ResumoFinanceiro;
  entradas: any[];
  saidas: any[];
  funcionarios: any[];
  graficoData: GraficoDataPoint[];
}

class ContadorService {
  /**
   * Get monthly financial data for accountant report
   * Aggregates data from multiple sources (transactions, employees, etc.)
   * 
   * @param mes Month in YYYY-MM format
   * @returns Financial data for the month
   * 
   * Obter dados financeiros mensais para relatório do contador
   * Agrega dados de múltiplas fontes (transações, funcionários, etc.)
   * 
   * @param mes Mês no formato AAAA-MM
   * @returns Dados financeiros para o mês
   */
  async getDadosMensais(mes: string): Promise<DadosFinanceiros> {
    try {
      // Parse month string to get year and month
      // Analisar a string do mês para obter o ano e o mês
      const [ano, mesNum] = mes.split('-').map(num => parseInt(num));
      
      // Calculate date range for the selected month
      // Calcular intervalo de datas para o mês selecionado
      const startDate = new Date(ano, mesNum - 1, 1);
      const endDate = new Date(ano, mesNum, 0);
      
      // In a real implementation, this would fetch data from the database
      // Em uma implementação real, isso buscaria dados do banco de dados
      
      // For demonstration purposes, return mock data
      // Para fins de demonstração, retornar dados mockados
      
      // TODO: Implement actual database queries
      // TODO: Implementar consultas reais ao banco de dados
      
      // Calculate summary data
      // Calcular dados de resumo
      const receita = 8750.50;
      const despesas = 6240.75;
      const saldo = receita - despesas;
      const funcionariosPagos = 5;
      
      const resumo: ResumoFinanceiro = {
        receita,
        despesas,
        saldo,
        funcionariosPagos
      };
      
      // Generate mock data for entries, expenses and employees
      // Gerar dados mockados para entradas, saídas e funcionários
      const entradas = [
        { id: 1, data: '2025-04-02', cliente: 'Restaurante Silva', descricao: 'Venda mensal', valor: 2300.50 },
        { id: 2, data: '2025-04-10', cliente: 'Café Central', descricao: 'Consultoria', valor: 1500.00 },
        { id: 3, data: '2025-04-15', cliente: 'Pizzaria Napoli', descricao: 'Treinamento', valor: 2800.00 },
        { id: 4, data: '2025-04-22', cliente: 'Bar do João', descricao: 'Serviços extras', valor: 950.00 },
        { id: 5, data: '2025-04-28', cliente: 'Lanchonete Boa Vista', descricao: 'Implementação', valor: 1200.00 }
      ];
      
      const saidas = [
        { id: 1, data: '2025-04-05', fornecedor: 'Aluguel', tipo: 'Infraestrutura', valor: 1800.00 },
        { id: 2, data: '2025-04-08', fornecedor: 'Luz e Água', tipo: 'Utilidades', valor: 450.75 },
        { id: 3, data: '2025-04-12', fornecedor: 'Materiais de Escritório', tipo: 'Suprimentos', valor: 320.00 },
        { id: 4, data: '2025-04-20', fornecedor: 'Marketing Digital', tipo: 'Publicidade', valor: 680.00 },
        { id: 5, data: '2025-04-25', fornecedor: 'Manutenção', tipo: 'Serviços', valor: 290.00 },
        { id: 6, data: '2025-04-30', fornecedor: 'Folha de Pagamento', tipo: 'Pessoal', valor: 2700.00 }
      ];
      
      const funcionarios = [
        { id: 1, nome: 'Ana Silva', tipoContrato: 'CLT', horasTrabalhadas: 160, valorPago: 1800.00 },
        { id: 2, nome: 'Carlos Mendes', tipoContrato: 'PJ', horasTrabalhadas: 120, valorPago: 2400.00 },
        { id: 3, nome: 'Mariana Costa', tipoContrato: 'CLT', horasTrabalhadas: 160, valorPago: 1600.00 },
        { id: 4, nome: 'Paulo Santos', tipoContrato: 'Estagiário', horasTrabalhadas: 120, valorPago: 800.00 },
        { id: 5, nome: 'Juliana Ferreira', tipoContrato: 'Terceirizado', horasTrabalhadas: 80, valorPago: 1200.00 }
      ];
      
      // Generate mock chart data
      // Gerar dados mockados para o gráfico
      const graficoData = [
        { dia: '01/04', receitas: 350, despesas: 280 },
        { dia: '08/04', receitas: 450, despesas: 320 },
        { dia: '15/04', receitas: 550, despesas: 450 },
        { dia: '22/04', receitas: 650, despesas: 400 },
        { dia: '29/04', receitas: 600, despesas: 350 },
      ];
      
      return {
        resumo,
        entradas,
        saidas,
        funcionarios,
        graficoData
      };
      
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      throw new Error('Falha ao recuperar dados financeiros mensais');
    }
  }
  
  /**
   * Generate PDF report for a specific month
   * Creates a formatted PDF document with all financial data
   * 
   * @param mes Month in YYYY-MM format
   * @returns PDF document stream
   * 
   * Gerar relatório PDF para um mês específico
   * Cria um documento PDF formatado com todos os dados financeiros
   * 
   * @param mes Mês no formato AAAA-MM
   * @returns Stream do documento PDF
   */
  async gerarRelatorioPDF(mes: string): Promise<Stream> {
    try {
      // Get financial data for the month
      // Obter dados financeiros para o mês
      const dados = await this.getDadosMensais(mes);
      
      // Create a new PDF document
      // Criar um novo documento PDF
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: `Relatório Financeiro - ${mes}`,
          Author: 'Estrateo App',
          Subject: 'Relatório Mensal para Contador'
        }
      });
      
      // Format month for display
      // Formatar mês para exibição
      const [ano, mesNum] = mes.split('-').map(num => parseInt(num));
      const dataFormatada = format(new Date(ano, mesNum - 1, 1), 'MMMM yyyy');
      
      // PDF Header
      // Cabeçalho do PDF
      doc.fontSize(25).text('Estrateo', { align: 'center' });
      doc.fontSize(18).text(`Relatório Financeiro - ${dataFormatada}`, { align: 'center' });
      doc.moveDown(2);
      
      // Summary section
      // Seção de resumo
      doc.fontSize(16).text('Resumo Financeiro', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', {
          style: 'currency',
          currency: 'EUR'
        }).format(value);
      };
      
      doc.text(`Receita Total: ${formatCurrency(dados.resumo.receita)}`);
      doc.text(`Despesas Totais: ${formatCurrency(dados.resumo.despesas)}`);
      doc.text(`Saldo Final: ${formatCurrency(dados.resumo.saldo)}`);
      doc.text(`Funcionários Pagos: ${dados.resumo.funcionariosPagos}`);
      doc.moveDown(2);
      
      // Income section
      // Seção de entradas
      doc.fontSize(16).text('Entradas', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      // Draw income table
      // Desenhar tabela de entradas
      this.drawTable(
        doc, 
        ['Data', 'Cliente', 'Descrição', 'Valor'],
        dados.entradas.map(entrada => [
          format(new Date(entrada.data), 'dd/MM/yyyy'),
          entrada.cliente,
          entrada.descricao,
          formatCurrency(entrada.valor)
        ])
      );
      doc.moveDown(2);
      
      // Expenses section
      // Seção de saídas
      doc.fontSize(16).text('Saídas', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      // Draw expenses table
      // Desenhar tabela de saídas
      this.drawTable(
        doc, 
        ['Data', 'Fornecedor', 'Tipo', 'Valor'],
        dados.saidas.map(saida => [
          format(new Date(saida.data), 'dd/MM/yyyy'),
          saida.fornecedor,
          saida.tipo,
          formatCurrency(saida.valor)
        ])
      );
      doc.moveDown(2);
      
      // Employees section
      // Seção de funcionários
      doc.fontSize(16).text('Funcionários', { underline: true });
      doc.moveDown();
      doc.fontSize(12);
      
      // Draw employees table
      // Desenhar tabela de funcionários
      this.drawTable(
        doc, 
        ['Nome', 'Tipo de Contrato', 'Horas Trabalhadas', 'Valor Pago'],
        dados.funcionarios.map(funcionario => [
          funcionario.nome,
          funcionario.tipoContrato,
          `${funcionario.horasTrabalhadas}h`,
          formatCurrency(funcionario.valorPago)
        ])
      );
      
      // Footer
      // Rodapé
      doc.moveDown(2);
      doc.fontSize(10).text(`Relatório gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, { align: 'center' });
      doc.text('Estrateo - Sistema de Gestão Empresarial', { align: 'center' });
      
      // Finalize the PDF
      // Finalizar o PDF
      doc.end();
      
      return doc;
      
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
      throw new Error('Falha ao gerar relatório PDF para o contador');
    }
  }
  
  /**
   * Helper method to draw tables in the PDF
   * 
   * @param doc PDF document
   * @param headers Table headers
   * @param rows Table data rows
   * 
   * Método auxiliar para desenhar tabelas no PDF
   * 
   * @param doc Documento PDF
   * @param headers Cabeçalhos da tabela
   * @param rows Linhas de dados da tabela
   */
  private drawTable(doc: PDFKit.PDFDocument, headers: string[], rows: string[][]) {
    // Table settings
    // Configurações da tabela
    const cellPadding = 5;
    const columnCount = headers.length;
    const tableWidth = 500;
    const columnWidth = tableWidth / columnCount;
    const rowHeight = 20;
    
    // Draw headers
    // Desenhar cabeçalhos
    doc.font('Helvetica-Bold');
    doc.fillColor('#444444');
    doc.rect(doc.x, doc.y, tableWidth, rowHeight).fillAndStroke('#EEEEEE', '#333333');
    
    doc.y += cellPadding;
    for (let i = 0; i < columnCount; i++) {
      doc.text(
        headers[i],
        doc.x + i * columnWidth + cellPadding,
        doc.y,
        { width: columnWidth - cellPadding * 2 }
      );
    }
    doc.y += rowHeight - cellPadding;
    
    // Draw rows
    // Desenhar linhas
    doc.font('Helvetica');
    for (let i = 0; i < rows.length; i++) {
      const isEvenRow = i % 2 === 0;
      doc.rect(doc.x, doc.y, tableWidth, rowHeight).fillAndStroke(isEvenRow ? '#FFFFFF' : '#F6F6F6', '#333333');
      
      doc.y += cellPadding;
      for (let j = 0; j < columnCount; j++) {
        doc.text(
          rows[i][j] || '',
          doc.x + j * columnWidth + cellPadding,
          doc.y,
          { width: columnWidth - cellPadding * 2 }
        );
      }
      doc.y += rowHeight - cellPadding;
    }
  }
}

export default new ContadorService(); 