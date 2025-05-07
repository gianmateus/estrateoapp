import { Router } from 'express';
import { PrismaClient } from '../generated/prisma';
import authMiddleware from '../middlewares/authMiddleware';
import { TaxForecastDTO, generateTaxForecast } from '../services/TaxEngine';
import { executeTaxForecastManually } from '../jobs/taxForecastJob';

const prisma = new PrismaClient();
const router = Router();

/**
 * @route   GET /api/taxes/forecast
 * @desc    Obtém a previsão fiscal para o mês informado
 * @access  Privado
 */
router.get('/forecast', authMiddleware, async (req, res) => {
  try {
    const { mes } = req.query;
    
    if (!mes || typeof mes !== 'string') {
      return res.status(400).json({ error: 'O parâmetro "mes" é obrigatório no formato YYYY-MM' });
    }
    
    // Validar formato do mês (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: 'Formato de mês inválido. Use YYYY-MM' });
    }
    
    // Usar o ID da empresa do usuário autenticado (ou um valor padrão para desenvolvimento)
    const empresaId = (req.user as any)?.empresaId || process.env.DEFAULT_EMPRESA_ID || 'default-empresa-id';
    
    // Buscar previsão existente no banco
    const existingForecast = await prisma.taxForecast.findFirst({
      where: {
        empresaId,
        mes
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Se já existe uma previsão recente (nas últimas 24h), retorna ela
    if (existingForecast && 
        (new Date().getTime() - existingForecast.createdAt.getTime()) < 24 * 60 * 60 * 1000) {
      return res.json({
        mes: existingForecast.mes,
        vatPayable: existingForecast.vatPayable,
        tradeTax: existingForecast.tradeTax,
        corpTax: existingForecast.corpTax,
        payrollTax: existingForecast.payrollTax
      } as TaxForecastDTO);
    }
    
    try {
      // Tentar calcular uma nova previsão
      const forecast = await generateTaxForecast(empresaId, mes);
      return res.json(forecast);
    } catch (calculationError) {
      console.error('Erro ao calcular previsão fiscal:', calculationError);
      
      // Em caso de erro ou sem dados, retornar objeto padrão com zeros
      return res.json({
        mes,
        vatPayable: 0,
        tradeTax: 0,
        corpTax: 0,
        payrollTax: 0
      } as TaxForecastDTO);
    }
  } catch (error) {
    console.error('Erro ao buscar previsão fiscal:', error);
    
    // Mesmo em caso de erro geral, retornar objeto padrão
    return res.json({
      mes: req.query.mes as string,
      vatPayable: 0,
      tradeTax: 0,
      corpTax: 0,
      payrollTax: 0
    } as TaxForecastDTO);
  }
});

/**
 * @route   POST /api/taxes/forecast/generate
 * @desc    Gera manualmente uma nova previsão fiscal
 * @access  Privado
 */
router.post('/forecast/generate', authMiddleware, async (req, res) => {
  try {
    const { mes } = req.body;
    
    if (!mes || typeof mes !== 'string') {
      return res.status(400).json({ error: 'O parâmetro "mes" é obrigatório no formato YYYY-MM' });
    }
    
    // Validar formato do mês (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: 'Formato de mês inválido. Use YYYY-MM' });
    }
    
    // Usar o ID da empresa do usuário autenticado
    const empresaId = (req.user as any)?.empresaId || process.env.DEFAULT_EMPRESA_ID || 'default-empresa-id';
    
    // Gerar previsão fiscal manualmente
    const forecast = await executeTaxForecastManually(empresaId, mes);
    
    return res.json(forecast);
  } catch (error) {
    console.error('Erro ao gerar previsão fiscal manualmente:', error);
    return res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});

export default router; 