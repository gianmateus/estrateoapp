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

// Função para obter o idioma salvo ou o padrão
const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem('appLanguage');
  
  // Mapeamento de códigos de idioma completos para códigos curtos
  const languageMap: { [key: string]: string } = {
    'pt-BR': 'pt',
    'en-US': 'en',
    'de-DE': 'de',
    'it-IT': 'it'
  };
  
  if (savedLanguage && languageMap[savedLanguage]) {
    return languageMap[savedLanguage];
  }
  
  // Detectar idioma do navegador se não houver preferência salva
  const browserLang = navigator.language.split('-')[0];
  return ['pt', 'en', 'de', 'it'].includes(browserLang) ? browserLang : 'en';
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
    // Configuração de fallback - inglês como padrão global
    fallbackLng: {
      'pt': ['en'],
      'de': ['en'],
      'it': ['en'],
      'default': ['en']
    },
    lng: getSavedLanguage(), // Usar o idioma salvo ou detectado
    supportedLngs: ['en', 'pt', 'de', 'it'],
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // não é necessário para React
    },
    
    detection: {
      order: ['localStorage', 'htmlTag', 'navigator'],
      lookupLocalStorage: 'appLanguage', // Nome da chave no localStorage
      caches: ['localStorage'],
    },
    
    // Configuração para carregar arquivos do diretório public/locales
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    // Garantir que o fallback funcione corretamente
    returnNull: false, // Não retornar null para chaves ausentes
    returnEmptyString: false, // Não retornar string vazia para chaves ausentes
    saveMissing: false, // Não salvar chaves ausentes (pode ser ativado em desenvolvimento)
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[i18n] Chave ausente: ${key} no idioma: ${lng}`);
      }
    },
    parseMissingKeyHandler: (key) => {
      // Isso garante que a chave ausente nunca aparece como [missing translation]
      return undefined; // Força usar o fallback
    }
  });

export default i18n; 