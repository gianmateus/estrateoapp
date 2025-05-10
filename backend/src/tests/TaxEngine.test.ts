import { PrismaClient } from '../generated/prisma';
import * as TaxEngine from '../services/TaxEngine';
import taxConfig from '../config/taxConfig';

// Mock do PrismaClient
jest.mock('../generated/prisma', () => {
  const mockPrisma = {
    financeiro: {
      findMany: jest.fn(),
    },
    resumoPagamento: {
      findMany: jest.fn(),
    },
    taxForecast: {
      create: jest.fn().mockResolvedValue({
        id: 'mocked-id',
        empresaId: 'test-empresa',
        mes: '2023-05',
        vatPayable: 1900,
        tradeTax: 350,
        corpTax: 1650,
        payrollTax: 2000,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

// Antes de cada teste, limpar os mocks
beforeEach(() => {
  jest.clearAllMocks();
});

describe('TaxEngine - Módulo de Cálculo de Impostos', () => {
  const prisma = new PrismaClient();
  const empresaId = 'test-empresa';
  const mes = '2023-05';
  
  test('Deve calcular corretamente o VAT para GmbH com lucro de 10k', async () => {
    // Configurar os mocks para simular receitas e despesas
    (prisma.financeiro.findMany as jest.Mock)
      .mockImplementationOnce(() => ([
        // Receitas: 10000€
        { valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }
      ]))
      .mockImplementationOnce(() => ([
        // Despesas: 0€ (para simplificar o teste)
        // Sem despesas neste cenário de teste
      ]));
    
    // VAT esperado: 10000 * 0.19 = 1900€
    const vatPayable = await TaxEngine.calcVAT(empresaId, mes);
    
    // Verificar se o cálculo está correto
    expect(vatPayable).toBeCloseTo(1900, 2);
    expect(prisma.financeiro.findMany).toHaveBeenCalledTimes(2);
  });
  
  test('Deve calcular corretamente o Trade Tax para GmbH com lucro de 10k', async () => {
    // Configurar os mocks para simular receitas e despesas
    (prisma.financeiro.findMany as jest.Mock)
      .mockImplementationOnce(() => ([
        // Receitas: 10000€
        { valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }
      ]))
      .mockImplementationOnce(() => ([
        // Despesas: 0€ (para simplificar o teste)
        // Sem despesas neste cenário de teste
      ]));
    
    // Trade Tax esperado: 10000 * 0.035 = 350€
    const tradeTax = await TaxEngine.calcTradeTax(empresaId, mes);
    
    // Verificar se o cálculo está correto
    expect(tradeTax).toBeCloseTo(350, 2);
    expect(prisma.financeiro.findMany).toHaveBeenCalledTimes(2);
  });
  
  test('Deve calcular corretamente o Corporate Tax para GmbH com lucro de 10k', async () => {
    // Configurar os mocks para simular receitas e despesas
    (prisma.financeiro.findMany as jest.Mock)
      .mockImplementationOnce(() => ([
        // Receitas: 10000€
        { valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }
      ]))
      .mockImplementationOnce(() => ([
        // Despesas: 0€ (para simplificar o teste)
        // Sem despesas neste cenário de teste
      ]));
    
    // Corp Tax: 10000 * 0.15 = 1500€
    // Solidariedade: 1500 * 0.055 = 82.5€
    // Total: 1582.5€ (arredondando para 1583€)
    const corpTax = await TaxEngine.calcCorpTax(empresaId, mes);
    
    // Verificar se o cálculo está correto
    expect(corpTax).toBeCloseTo(1582.5, 2);
    expect(prisma.financeiro.findMany).toHaveBeenCalledTimes(2);
  });
  
  test('Deve calcular corretamente o Payroll Tax para folha de 10k', async () => {
    // Configurar o mock para simular pagamentos de salários
    (prisma.resumoPagamento.findMany as jest.Mock).mockResolvedValue([
      { salarioReal: 10000, mes: '05-2023' }
    ]);
    
    // Payroll Tax esperado: 10000 * 0.20 = 2000€
    const payrollTax = await TaxEngine.calcPayrollTax(empresaId, mes);
    
    // Verificar se o cálculo está correto
    expect(payrollTax).toBeCloseTo(2000, 2);
    expect(prisma.resumoPagamento.findMany).toHaveBeenCalledTimes(1);
  });
  
  test('Deve gerar corretamente uma previsão fiscal completa', async () => {
    // Configurar mocks para todos os cálculos
    // VAT
    (prisma.financeiro.findMany as jest.Mock)
      .mockImplementationOnce(() => ([{ valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }]))
      .mockImplementationOnce(() => ([]))
      // Trade Tax
      .mockImplementationOnce(() => ([{ valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }]))
      .mockImplementationOnce(() => ([]))
      // Corp Tax
      .mockImplementationOnce(() => ([{ valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }]))
      .mockImplementationOnce(() => ([]));
    
    // Payroll Tax
    (prisma.resumoPagamento.findMany as jest.Mock).mockResolvedValue([
      { salarioReal: 10000, mes: '05-2023' }
    ]);
    
    // Gerar a previsão completa
    const forecast = await TaxEngine.generateTaxForecast(empresaId, mes);
    
    // Verificar se todos os valores foram calculados corretamente
    expect(forecast.vatPayable).toBeCloseTo(1900, 2);
    expect(forecast.tradeTax).toBeCloseTo(350, 2);
    expect(forecast.corpTax).toBeCloseTo(1582.5, 2);
    expect(forecast.payrollTax).toBeCloseTo(2000, 2);
    
    // Verificar se a previsão foi salva no banco de dados
    expect(prisma.taxForecast.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        empresaId,
        mes,
        vatPayable: expect.any(Number),
        tradeTax: expect.any(Number),
        corpTax: expect.any(Number),
        payrollTax: expect.any(Number)
      })
    });
  });
  
  test('Deve calcular corretamente o VAT para vendas 10.000€ e compras 2.000€', async () => {
    // Configurar mocks - vendas de 10.000€ e compras de 2.000€
    (prisma.financeiro.findMany as jest.Mock)
      .mockImplementationOnce(() => ([{ valor: 10000, tipo: 'receita', data: new Date('2023-05-15') }])) // Vendas
      .mockImplementationOnce(() => ([{ valor: 2000, tipo: 'despesa', data: new Date('2023-05-15') }])); // Compras
    
    // O VAT é calculado como: 
    // - Para vendas: 10.000 * 0.19 = 1.900€ (débito)
    // - Para compras: 2.000 * (0.19 / 1.19) = 319.33€ (crédito) aproximadamente
    // - VAT a pagar: 1.900 - 319.33 = 1.580,67€
    
    const resultado = await TaxEngine.calcVAT(empresaId, mes);
    
    // Verificamos se o resultado é aproximadamente 1.580,67€
    expect(resultado).toBeCloseTo(1580.67, 1);
  });
}); 