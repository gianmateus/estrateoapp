import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Importar recursos de tradução
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';
import translationDE from './locales/de/translation.json';
import translationIT from './locales/it/translation.json';

// Os recursos de tradução
const resources = {
  en: {
    translation: translationEN
  },
  pt: {
    translation: translationPT
  },
  de: {
    translation: translationDE
  },
  it: {
    translation: translationIT
  }
};

i18n
  // Carregar traduções do backend
  .use(Backend)
  // Detectar idioma do navegador
  .use(LanguageDetector)
  // Passar a instância i18n para react-i18next
  .use(initReactI18next)
  // Inicializar i18next
  .init({
    resources,
    fallbackLng: 'en', // Inglês como idioma padrão
    supportedLngs: ['en', 'pt', 'de', 'it'],
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // não é necessário para React
    },
    
    detection: {
      // Ordem de detecção conforme solicitado
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng', // Nome da chave no localStorage
      caches: ['localStorage'],
    },
    
    // Configuração para carregar arquivos do diretório public/locales
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Garantir que o fallback funcione corretamente
    returnNull: false, // Não retornar null para chaves ausentes
    returnEmptyString: false, // Não retornar string vazia para chaves ausentes
  });

// Funções de utilidade para formatação
export const formatCurrency = (value: number, locale: string = i18n.language): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const formatNumber = (value: number, locale: string = i18n.language): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatDate = (date: Date | string | number, locale: string = i18n.language): string => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

export default i18n; 