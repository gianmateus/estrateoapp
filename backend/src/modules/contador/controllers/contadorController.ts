/**
 * Controller for the Contador (Accountant) module
 * Handles HTTP requests and responses for financial data and PDF report generation
 * 
 * Controlador para o módulo Contador
 * Gerencia requisições e respostas HTTP para dados financeiros e geração de relatórios PDF
 */
import { Request, Response } from 'express';
import contadorService from '../services/contadorService';

export class ContadorController {
  /**
   * Get monthly financial data for accountant report
   * 
   * @param req Express request object
   * @param res Express response object
   * @returns JSON response with financial data
   * 
   * Obter dados financeiros mensais para relatório do contador
   * 
   * @param req Objeto de requisição Express
   * @param res Objeto de resposta Express
   * @returns Resposta JSON com dados financeiros
   */
  async getDadosMensais(req: Request, res: Response) {
    try {
      const { mes } = req.params;
      
      // Validate month format (YYYY-MM)
      // Validar formato do mês (AAAA-MM)
      if (!/^\d{4}-\d{2}$/.test(mes)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Formato de mês inválido. Use o formato AAAA-MM.' 
        });
      }
      
      const dados = await contadorService.getDadosMensais(mes);
      return res.status(200).json({ 
        success: true, 
        data: dados 
      });
      
    } catch (error) {
      console.error('Erro no controlador getDadosMensais:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar dados financeiros mensais' 
      });
    }
  }
  
  /**
   * Generate PDF report for a specific month
   * 
   * @param req Express request object
   * @param res Express response object
   * @returns PDF document stream
   * 
   * Gerar relatório PDF para um mês específico
   * 
   * @param req Objeto de requisição Express
   * @param res Objeto de resposta Express
   * @returns Stream do documento PDF
   */
  async gerarRelatorioPDF(req: Request, res: Response) {
    try {
      const { mes } = req.params;
      
      // Validate month format (YYYY-MM)
      // Validar formato do mês (AAAA-MM)
      if (!/^\d{4}-\d{2}$/.test(mes)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Formato de mês inválido. Use o formato AAAA-MM.' 
        });
      }
      
      // Get PDF document stream
      // Obter stream do documento PDF
      const pdfStream = await contadorService.gerarRelatorioPDF(mes);
      
      // Set response headers for PDF download
      // Definir cabeçalhos de resposta para download do PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Relatorio_Contador_${mes}.pdf`);
      
      // Send PDF stream as response
      // Enviar stream do PDF como resposta
      pdfStream.pipe(res);
      
    } catch (error) {
      console.error('Erro no controlador gerarRelatorioPDF:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erro ao gerar relatório PDF' 
      });
    }
  }
} 