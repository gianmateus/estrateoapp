import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { FuncionarioService } from '../services/FuncionarioService';
import { ResumoPagamentoService } from '../services/ResumoPagamentoService';

/**
 * Classe para geração de relatórios em PDF
 * Class for generating PDF reports
 */
export class PDFGenerator {
  private funcionarioService: FuncionarioService;
  private resumoPagamentoService: ResumoPagamentoService;

  constructor() {
    this.funcionarioService = new FuncionarioService();
    this.resumoPagamentoService = new ResumoPagamentoService();
  }

  /**
   * Gera o PDF de um funcionário específico
   * Generates a PDF for a specific employee
   * @param funcionarioId ID do funcionário
   * @returns Caminho do arquivo gerado
   */
  async generateFuncionarioPDF(funcionarioId: string): Promise<string> {
    try {
      const funcionario = await this.funcionarioService.findById(funcionarioId);
      
      if (!funcionario) {
        throw new Error('Funcionário não encontrado');
      }
      
      const uploadsDir = path.join(__dirname, '../../../..', 'uploads');
      
      // Cria o diretório se não existir
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `funcionario_${funcionario.id}_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Cria o documento PDF
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);
      
      // Adiciona o cabeçalho
      // Add header
      doc.fontSize(20).text('Estrateo - Ficha de Funcionário', { align: 'center' });
      doc.moveDown();
      
      // Adiciona a data de geração
      // Add generation date
      const hoje = new Date().toLocaleDateString('pt-BR');
      doc.fontSize(10).text(`Gerado em: ${hoje}`, { align: 'right' });
      doc.moveDown();
      
      // Adiciona informações do funcionário
      // Add employee information
      doc.fontSize(16).text('Dados Pessoais', { underline: true });
      doc.moveDown();
      
      doc.fontSize(12).text(`Nome: ${funcionario.nome}`);
      doc.fontSize(12).text(`Cargo: ${funcionario.cargo}`);
      doc.fontSize(12).text(`Tipo de Contrato: ${funcionario.tipoContrato}`);
      doc.fontSize(12).text(`Data de Admissão: ${funcionario.dataAdmissao.toLocaleDateString('pt-BR')}`);
      doc.fontSize(12).text(`Status: ${funcionario.status}`);
      if (funcionario.iban) {
        doc.fontSize(12).text(`IBAN: ${funcionario.iban}`);
      }
      doc.moveDown();
      
      // Adiciona informações financeiras
      // Add financial information
      doc.fontSize(16).text('Dados Financeiros', { underline: true });
      doc.moveDown();
      
      doc.fontSize(12).text(`Salário Bruto: €${funcionario.salarioBruto.toFixed(2)}`);
      doc.fontSize(12).text(`Pagamento por Hora: ${funcionario.pagamentoPorHora ? 'Sim' : 'Não'}`);
      doc.fontSize(12).text(`Horas Semanais: ${funcionario.horasSemana}`);
      doc.fontSize(12).text(`Dias de Trabalho: ${funcionario.diasTrabalho.join(', ')}`);
      doc.moveDown();
      
      // Adiciona observações se existirem
      // Add observations if they exist
      if (funcionario.observacoes) {
        doc.fontSize(16).text('Observações', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(funcionario.observacoes);
        doc.moveDown();
      }
      
      // Finaliza o documento
      // Finalize the document
      doc.end();
      
      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          resolve(filePath);
        });
        
        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Erro ao gerar PDF do funcionário:', error);
      throw new Error('Não foi possível gerar o PDF do funcionário');
    }
  }

  /**
   * Gera o PDF com o resumo de pagamento de um mês específico
   * Generates a PDF with the payment summary for a specific month
   * @param mes Mês no formato MM-YYYY
   * @returns Caminho do arquivo gerado
   */
  async generateResumoPagamentoMensalPDF(mes: string): Promise<string> {
    try {
      const resumos = await this.resumoPagamentoService.findByMes(mes);
      
      if (resumos.length === 0) {
        throw new Error('Nenhum resumo de pagamento encontrado para este mês');
      }
      
      const uploadsDir = path.join(__dirname, '../../../..', 'uploads');
      
      // Cria o diretório se não existir
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const fileName = `resumo_pagamentos_${mes.replace('-', '_')}.pdf`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Cria o documento PDF
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);
      
      // Adiciona o cabeçalho
      // Add header
      doc.fontSize(20).text('Estrateo - Resumo Mensal de Pagamentos', { align: 'center' });
      doc.moveDown();
      
      // Adiciona o mês do relatório
      // Add report month
      const [month, year] = mes.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'long' });
      doc.fontSize(16).text(`Mês: ${monthName} de ${year}`, { align: 'center' });
      doc.moveDown();
      
      // Adiciona a data de geração
      // Add generation date
      const hoje = new Date().toLocaleDateString('pt-BR');
      doc.fontSize(10).text(`Gerado em: ${hoje}`, { align: 'right' });
      doc.moveDown(2);
      
      // Adiciona cabeçalho da tabela
      // Add table header
      const startX = 50;
      let currentY = doc.y;
      
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Funcionário', startX, currentY, { width: 150 });
      doc.text('Cargo', startX + 150, currentY, { width: 100 });
      doc.text('Tipo', startX + 250, currentY, { width: 70 });
      doc.text('Previsto', startX + 320, currentY, { width: 70, align: 'right' });
      doc.text('Real', startX + 390, currentY, { width: 70, align: 'right' });
      doc.text('Extras', startX + 460, currentY, { width: 70, align: 'right' });
      
      doc.moveDown();
      currentY = doc.y;
      
      // Adiciona linha divisória
      // Add dividing line
      doc.moveTo(startX, currentY - 5).lineTo(startX + 530, currentY - 5).stroke();
      
      // Adiciona dados dos funcionários
      // Add employee data
      doc.font('Helvetica');
      
      let totalPrevisto = 0;
      let totalReal = 0;
      let totalExtras = 0;
      
      resumos.forEach((resumo) => {
        currentY = doc.y;
        
        doc.text(resumo.funcionario.nome, startX, currentY, { width: 150 });
        doc.text(resumo.funcionario.cargo, startX + 150, currentY, { width: 100 });
        doc.text(resumo.funcionario.tipoContrato, startX + 250, currentY, { width: 70 });
        doc.text(`€${resumo.salarioPrevisto.toFixed(2)}`, startX + 320, currentY, { width: 70, align: 'right' });
        doc.text(`€${resumo.salarioReal.toFixed(2)}`, startX + 390, currentY, { width: 70, align: 'right' });
        doc.text(`€${resumo.extras ? resumo.extras.toFixed(2) : '0.00'}`, startX + 460, currentY, { width: 70, align: 'right' });
        
        doc.moveDown();
        
        // Destaca MiniJobs acima do limite
        // Highlight MiniJobs above the limit
        if (resumo.funcionario.tipoContrato === 'Minijob' && 
            (resumo.salarioReal + (resumo.extras || 0)) > 538) {
          currentY = doc.y;
          doc.fillColor('red')
             .text('⚠️ Limite MiniJob excedido!', startX, currentY, { width: 530 })
             .fillColor('black');
          doc.moveDown();
        }
        
        totalPrevisto += resumo.salarioPrevisto;
        totalReal += resumo.salarioReal;
        totalExtras += resumo.extras || 0;
      });
      
      // Adiciona linha divisória
      // Add dividing line
      currentY = doc.y;
      doc.moveTo(startX, currentY).lineTo(startX + 530, currentY).stroke();
      doc.moveDown();
      
      // Adiciona totais
      // Add totals
      currentY = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('TOTAL', startX, currentY, { width: 150 });
      doc.text(`€${totalPrevisto.toFixed(2)}`, startX + 320, currentY, { width: 70, align: 'right' });
      doc.text(`€${totalReal.toFixed(2)}`, startX + 390, currentY, { width: 70, align: 'right' });
      doc.text(`€${totalExtras.toFixed(2)}`, startX + 460, currentY, { width: 70, align: 'right' });
      
      doc.moveDown(2);
      
      // Adiciona observação sobre o relatório
      // Add note about the report
      doc.fontSize(10).font('Helvetica');
      doc.text('Este relatório contém informações confidenciais e deve ser tratado com sigilo. ' +
               'Valores estão sujeitos à verificação pelo departamento contábil.', { align: 'center' });
      
      // Finaliza o documento
      // Finalize the document
      doc.end();
      
      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          resolve(filePath);
        });
        
        stream.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Erro ao gerar PDF de resumo mensal:', error);
      throw new Error('Não foi possível gerar o PDF de resumo mensal');
    }
  }
} 