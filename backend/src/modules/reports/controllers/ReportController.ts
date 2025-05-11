import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export class ReportController {
  private reportService: ReportService;

  constructor() {
    this.reportService = new ReportService();
  }

  generateReport = async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const today = new Date();

      let startDate: Date;
      let endDate: Date;

      if (type === 'daily') {
        startDate = startOfDay(today);
        endDate = endOfDay(today);
      } else if (type === 'weekly') {
        startDate = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira
        endDate = endOfWeek(today, { weekStartsOn: 1 }); // Domingo
      } else if (type === 'monthly') {
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
      } else {
        return res.status(400).json({ error: 'Tipo de relatório inválido' });
      }

      const reportData = await this.reportService.generateReport(startDate, endDate);
      return res.json(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({ error: 'Erro ao gerar relatório' });
    }
  };
} 