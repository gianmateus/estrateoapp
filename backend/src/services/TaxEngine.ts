import { PrismaClient } from '../generated/prisma';
import taxConfig from '../config/taxConfig';

const prisma = new PrismaClient();

export interface TaxForecastDTO {
  mes: string;
  vatPayable: number;
  tradeTax: number;
  corpTax: number;
  payrollTax: number;
}

/**
 * Calcula o imposto sobre valor agregado (VAT) com base nos dados de receitas e despesas
 * @param empresaId ID da empresa
 * @param mes Mês de referência no formato YYYY-MM
 * @returns Valor estimado de VAT a pagar
 */
export async function calcVAT(empresaId: string, mes: string): Promise<number> {
  // Extrair ano e mês da string YYYY-MM
  const [year, month] = mes.split('-');
  
  // Calcular datas de início e fim do mês
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(parseInt(year), parseInt(month), 0); // Último dia do mês
  
  // Buscar receitas (que geram VAT a cobrar)
  const receitas = await prisma.financeiro.findMany({
    where: {
      tipo: 'receita',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  // Buscar despesas (que geram VAT a recuperar)
  const despesas = await prisma.financeiro.findMany({
    where: {
      tipo: 'despesa',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  // Calcular VAT com base nas receitas (débito)
  const vatDebito = receitas.reduce((acc, receita) => {
    // Se a empresa for smallBusiness (§19), não há VAT a cobrar
    if (taxConfig.isSmallBusiness) return acc;
    
    return acc + (receita.valor * taxConfig.vatRate / 100);
  }, 0);
  
  // Calcular VAT com base nas despesas (crédito)
  const vatCredito = despesas.reduce((acc, despesa) => {
    // Se a empresa for smallBusiness (§19), não há VAT a recuperar
    if (taxConfig.isSmallBusiness) return acc;
    
    // Assumindo que a despesa já inclui o VAT e que todas são elegíveis para crédito
    // Cálculo: valor * (taxa / (100 + taxa))
    return acc + (despesa.valor * (taxConfig.vatRate / (100 + taxConfig.vatRate)));
  }, 0);
  
  // VAT a pagar é a diferença entre débito e crédito
  return Math.max(0, vatDebito - vatCredito);
}

/**
 * Calcula o imposto comercial (Trade Tax / Gewerbesteuer)
 * @param empresaId ID da empresa
 * @param mes Mês de referência no formato YYYY-MM
 * @returns Valor estimado de imposto comercial a pagar
 */
export async function calcTradeTax(empresaId: string, mes: string): Promise<number> {
  // Extrair ano e mês
  const [year, month] = mes.split('-');
  
  // Calcular datas
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(parseInt(year), parseInt(month), 0);
  
  // Calcular receitas totais
  const receitas = await prisma.financeiro.findMany({
    where: {
      tipo: 'receita',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
  
  // Calcular despesas totais
  const despesas = await prisma.financeiro.findMany({
    where: {
      tipo: 'despesa',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  
  // Lucro estimado
  const lucroEstimado = totalReceitas - totalDespesas;
  
  // Freelancers e profissionais liberais geralmente não pagam Gewerbesteuer
  if (taxConfig.tipoEmpresa === 'Freelancer') {
    return 0;
  }
  
  // Cálculo simplificado do imposto comercial
  // Na realidade, há um cálculo mais complexo com isenções e bases de cálculo específicas
  return Math.max(0, lucroEstimado * (taxConfig.tradeTaxMultiplier / 100));
}

/**
 * Calcula o imposto de renda corporativo (Corporate Tax / Körperschaftsteuer)
 * @param empresaId ID da empresa
 * @param mes Mês de referência no formato YYYY-MM
 * @returns Valor estimado de imposto corporativo a pagar
 */
export async function calcCorpTax(empresaId: string, mes: string): Promise<number> {
  // Extrair ano e mês
  const [year, month] = mes.split('-');
  
  // Calcular datas
  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(parseInt(year), parseInt(month), 0);
  
  // Calcular receitas totais
  const receitas = await prisma.financeiro.findMany({
    where: {
      tipo: 'receita',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  const totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
  
  // Calcular despesas totais
  const despesas = await prisma.financeiro.findMany({
    where: {
      tipo: 'despesa',
      data: {
        gte: startDate,
        lte: endDate
      }
    }
  });
  
  const totalDespesas = despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  
  // Lucro estimado
  const lucroEstimado = totalReceitas - totalDespesas;
  
  // Freelancers e Kleinunternehmer pagam imposto de renda pessoal, não corporativo
  if (taxConfig.tipoEmpresa === 'Freelancer' || taxConfig.tipoEmpresa === 'Kleinunternehmer') {
    return 0;
  }
  
  // Cálculo simplificado do imposto corporativo + taxa de solidariedade
  const corpTaxBase = lucroEstimado * (taxConfig.corpTaxRate / 100);
  const solidarityTax = corpTaxBase * (taxConfig.solidarityRate / 100);
  
  return Math.max(0, corpTaxBase + solidarityTax);
}

/**
 * Calcula os impostos sobre folha de pagamento
 * @param empresaId ID da empresa
 * @param mes Mês de referência no formato YYYY-MM
 * @returns Valor estimado de impostos sobre folha de pagamento
 */
export async function calcPayrollTax(empresaId: string, mes: string): Promise<number> {
  // Extrair ano e mês
  const [year, month] = mes.split('-');
  
  // Calcular datas
  const startOfMonth = new Date(`${year}-${month}-01`);
  const [yearNum, monthNum] = [parseInt(year), parseInt(month)];
  const endOfMonth = new Date(yearNum, monthNum, 0); // Último dia do mês
  
  // Obter dados da folha de pagamento do mês
  const resumoPagamentos = await prisma.resumoPagamento.findMany({
    where: {
      mes: `${monthNum.toString().padStart(2, '0')}-${year}` // Assumindo formato MM-YYYY
    }
  });
  
  // Soma dos salários pagos no mês
  const totalSalarios = resumoPagamentos.reduce((acc, pagamento) => {
    return acc + pagamento.salarioReal;
  }, 0);
  
  // Cálculo simplificado dos encargos sociais
  // Na realidade, há diferentes taxas para diferentes componentes (saúde, aposentadoria, etc.)
  return totalSalarios * (taxConfig.payrollBaseRate / 100);
}

/**
 * Gera uma previsão completa de impostos para o mês especificado
 * @param empresaId ID da empresa
 * @param mes Mês de referência no formato YYYY-MM
 * @returns Objeto com todos os impostos calculados
 */
export async function generateTaxForecast(empresaId: string, mes: string): Promise<TaxForecastDTO> {
  // Calcular cada imposto
  const vatPayable = await calcVAT(empresaId, mes);
  const tradeTax = await calcTradeTax(empresaId, mes);
  const corpTax = await calcCorpTax(empresaId, mes);
  const payrollTax = await calcPayrollTax(empresaId, mes);
  
  // Criar e salvar a previsão no banco de dados
  await prisma.taxForecast.create({
    data: {
      empresaId,
      mes,
      vatPayable,
      tradeTax,
      corpTax,
      payrollTax
    }
  });
  
  // Retornar o objeto com os valores calculados
  return {
    mes,
    vatPayable,
    tradeTax,
    corpTax,
    payrollTax
  };
} 