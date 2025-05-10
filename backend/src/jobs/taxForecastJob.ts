import * as cron from 'node-cron';
import { PrismaClient } from '../generated/prisma';
import { generateTaxForecast } from '../services/TaxEngine';
import { format } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Job para gerar automaticamente previsões fiscais para todas as empresas
 * Executa diariamente à meia-noite
 */
export function startTaxForecastJob() {
  // Executar todos os dias à meia-noite (0 0 * * *)
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Iniciando job de previsão fiscal...');
      
      // Buscar todas as empresas ativas
      // Para fins de teste/desenvolvimento, estamos usando um ID fixo
      const empresaId = process.env.DEFAULT_EMPRESA_ID || 'default-empresa-id';
      
      // Calcular a previsão para o mês atual
      const currentMonth = format(new Date(), 'yyyy-MM');
      
      // Gerar previsão
      const forecast = await generateTaxForecast(empresaId, currentMonth);
      
      console.log(`Previsão fiscal gerada com sucesso para ${currentMonth}`);
      console.log(forecast);
      
    } catch (error) {
      console.error('Erro ao executar job de previsão fiscal:', error);
    }
  });
  
  console.log('Job de previsão fiscal agendado com sucesso');
}

/**
 * Executa manualmente a geração de previsão fiscal para uma empresa
 * Útil para ambiente de desenvolvimento ou testes
 */
export async function executeTaxForecastManually(empresaId: string, mes: string) {
  try {
    console.log(`Gerando previsão fiscal manualmente para ${empresaId} no mês ${mes}...`);
    
    const forecast = await generateTaxForecast(empresaId, mes);
    
    console.log('Previsão fiscal gerada com sucesso:');
    console.log(forecast);
    
    return forecast;
  } catch (error) {
    console.error('Erro ao gerar previsão fiscal manualmente:', error);
    throw error;
  }
} 