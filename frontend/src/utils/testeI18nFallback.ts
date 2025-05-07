import i18n from '../i18n';

/**
 * Função para testar o fallback do i18n
 * Esta função pode ser chamada do console para verificar se o fallback está funcionando
 * 
 * @example
 * // No console do navegador
 * import { testeI18nFallback } from './utils/testeI18nFallback';
 * testeI18nFallback();
 */
export const testeI18nFallback = () => {
  // Salvar o idioma atual
  const idiomaAtual = i18n.language;
  
  console.log('=== TESTE DE FALLBACK i18n ===');
  console.log(`Idioma atual: ${idiomaAtual}`);
  
  // Testar algumas chaves existentes em todos os idiomas
  const chavesComuns = ['dashboard', 'financeiro', 'inventario'];
  console.log('\nTestando chaves comuns em todos os idiomas:');
  
  ['pt', 'en', 'de', 'it'].forEach(lang => {
    console.log(`\nIdioma: ${lang}`);
    chavesComuns.forEach(chave => {
      const traducao = i18n.getFixedT(lang)(chave);
      console.log(`- ${chave}: ${traducao}`);
    });
  });
  
  // Testar uma chave que foi propositalmente removida do português
  // Para testar, remova temporariamente a chave 'dashboardObj.title' do pt.json
  console.log('\nTestando fallback de chaves ausentes:');
  
  // Mudar para português primeiro
  i18n.changeLanguage('pt');
  
  // Testar algumas chaves que podem não existir em PT
  const chavesParaTestar = [
    'dashboardObj.title', // Se foi removida, deve usar o fallback inglês
    'teste.chave.ausente', // Chave totalmente ausente
    'finance_recurrence_quarterly' // Chave que pode estar em um idioma mas não em outro
  ];
  
  chavesParaTestar.forEach(chave => {
    const traducao = i18n.t(chave);
    const existeEmPT = i18n.exists(chave, { lng: 'pt' });
    const existeEmEN = i18n.exists(chave, { lng: 'en' });
    
    console.log(`Chave: ${chave}`);
    console.log(`- Existe em PT: ${existeEmPT}`);
    console.log(`- Existe em EN: ${existeEmEN}`);
    console.log(`- Tradução obtida: ${traducao}`);
    
    // Verificar se está usando o fallback corretamente
    if (!existeEmPT && existeEmEN) {
      const traducaoEN = i18n.getFixedT('en')(chave);
      console.log(`- Fallback funcionando: ${traducao === traducaoEN ? 'SIM ✅' : 'NÃO ❌'}`);
    }
    
    console.log('---');
  });
  
  // Restaurar o idioma original
  i18n.changeLanguage(idiomaAtual);
  
  console.log('\n=== TESTE CONCLUÍDO ===');
  return 'Teste de fallback concluído. Verifique o console para resultados.';
};

export default testeI18nFallback; 