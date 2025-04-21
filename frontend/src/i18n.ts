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
    fallbackLng: 'en',
    lng: 'en', // Definir inglês como idioma padrão
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // não é necessário para React
    },
    
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      caches: [],
    },
    
    // Configuração para carregar arquivos do diretório public/locales
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    }
  });

// Forçar o idioma inglês
i18n.changeLanguage('en');

export default i18n; 