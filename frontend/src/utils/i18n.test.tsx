import { formatCurrency, formatDate, formatNumber } from './formatters';

describe('Formatação internacional', () => {
  describe('Formatação de moeda em euro', () => {
    const valor = 1200.50;
    
    test('Deve formatar em inglês (en-GB)', () => {
      const resultado = formatCurrency(valor, 'en-GB');
      expect(resultado).toBe('€1,200.50');
    });
    
    test('Deve formatar em português (pt-BR)', () => {
      const resultado = formatCurrency(valor, 'pt-BR');
      expect(resultado).toBe('€ 1.200,50');
    });
    
    test('Deve formatar em alemão (de-DE)', () => {
      const resultado = formatCurrency(valor, 'de-DE');
      expect(resultado).toBe('1.200,50 €');
    });
    
    test('Deve formatar em italiano (it-IT)', () => {
      const resultado = formatCurrency(valor, 'it-IT');
      expect(resultado).toBe('1.200,50 €');
    });
  });
  
  describe('Formatação de números', () => {
    const valor = 1234567.89;
    
    test('Deve formatar em inglês (en-GB)', () => {
      const resultado = formatNumber(valor, 'en-GB');
      expect(resultado).toBe('1,234,567.89');
    });
    
    test('Deve formatar em português (pt-BR)', () => {
      const resultado = formatNumber(valor, 'pt-BR');
      expect(resultado).toBe('1.234.567,89');
    });
    
    test('Deve formatar em alemão (de-DE)', () => {
      const resultado = formatNumber(valor, 'de-DE');
      expect(resultado).toBe('1.234.567,89');
    });
    
    test('Deve formatar em italiano (it-IT)', () => {
      const resultado = formatNumber(valor, 'it-IT');
      expect(resultado).toBe('1.234.567,89');
    });
  });
  
  describe('Formatação de datas', () => {
    // Data de exemplo: 15 de março de 2023
    const data = new Date(2023, 2, 15);
    
    test('Deve formatar em inglês (en-GB)', () => {
      const resultado = formatDate(data, 'en-GB');
      expect(resultado).toBe('15/03/2023');
    });
    
    test('Deve formatar em português (pt-BR)', () => {
      const resultado = formatDate(data, 'pt-BR');
      expect(resultado).toBe('15/03/2023');
    });
    
    test('Deve formatar em alemão (de-DE)', () => {
      const resultado = formatDate(data, 'de-DE');
      expect(resultado).toBe('15.03.2023');
    });
    
    test('Deve formatar em italiano (it-IT)', () => {
      const resultado = formatDate(data, 'it-IT');
      expect(resultado).toBe('15/03/2023');
    });
  });
}); 