import React, { createContext, useState, ReactNode, useEffect } from 'react';
import i18n from '../i18n';

/**
 * Definição de traduções para diferentes idiomas
 * Translation definitions for different languages
 */
export const translations = {
  'pt-BR': {
    hero: {
      title: 'Gestão Inteligente para seu Negócio',
      subtitle: 'Simplifique a administração do seu empreendimento com nossa plataforma alimentada por inteligência artificial. Controle financeiro, inventário e receba recomendações personalizadas em um único lugar.',
      cta: 'Experimente Grátis',
      secondaryCta: 'Saiba Mais',
    },
    features: {
      title: 'Funcionalidades Principais',
      inventory: {
        title: 'Controle de Inventário',
        description: 'Gerencie seu estoque com facilidade, receba alertas inteligentes e otimize suas compras semanais baseado em tendências.'
      },
      financial: {
        title: 'Gestão Financeira',
        description: 'Acompanhe entradas e saídas, categorize despesas e visualize relatórios detalhados para melhorar sua lucratividade.'
      },
      ai: {
        title: 'Inteligência Artificial',
        description: 'Receba recomendações personalizadas, previsões de vendas e análises sazonais que ajudam na tomada de decisões.'
      }
    },
    pricing: {
      title: 'Planos e Preços',
      subtitle: 'Escolha o plano que melhor se adapta às necessidades do seu negócio.',
      recommended: 'Mais Popular',
      month: '/mês',
      basic: 'Básico',
      professional: 'Profissional',
      premium: 'Premium',
      startNow: 'Começar Agora',
      tryFree: 'Experimente Grátis',
      contactUs: 'Contate-nos',
      startButton: 'Começar',
      mostPopular: 'Mais Popular',
      enterprise: 'Enterprise'
    },
    login: {
      title: 'Já é cliente?',
      subtitle: 'Acesse nossa plataforma para gerenciar seu negócio',
      buttonText: 'Acessar Painel'
    },
    newsletter: {
      title: 'Receba nossas novidades',
      name: 'Nome',
      email: 'Email',
      subscribe: 'Inscrever-se',
      successMessage: 'Obrigado por se inscrever na nossa newsletter!'
    }
  },
  'en-US': {
    hero: {
      title: 'Intelligent Business Management',
      subtitle: 'Simplify your business administration with our AI-powered platform. Financial control, inventory management, and personalized recommendations in one place.',
      cta: 'Try it Free',
      secondaryCta: 'Learn More',
    },
    features: {
      title: 'Key Features',
      inventory: {
        title: 'Inventory Control',
        description: 'Manage your stock easily, receive smart alerts, and optimize your weekly purchases based on trends.'
      },
      financial: {
        title: 'Financial Management',
        description: 'Track income and expenses, categorize costs, and view detailed reports to improve your profitability.'
      },
      ai: {
        title: 'Artificial Intelligence',
        description: 'Get personalized recommendations, sales forecasts, and seasonal analyses that help in decision making.'
      }
    },
    pricing: {
      title: 'Plans and Pricing',
      subtitle: 'Choose the plan that best fits your business needs.',
      recommended: 'Most Popular',
      month: '/month',
      basic: 'Basic',
      professional: 'Professional',
      premium: 'Premium',
      startNow: 'Get Started',
      tryFree: 'Try it Free',
      contactUs: 'Contact Us',
      startButton: 'Get Started',
      mostPopular: 'Most Popular',
      enterprise: 'Enterprise'
    },
    login: {
      title: 'Already a customer?',
      subtitle: 'Access our platform to manage your business',
      buttonText: 'Access Dashboard'
    },
    newsletter: {
      title: 'Get our updates',
      name: 'Name',
      email: 'Email',
      subscribe: 'Subscribe',
      successMessage: 'Thank you for subscribing to our newsletter!'
    }
  },
  'de-DE': {
    hero: {
      title: 'Intelligente Geschäftsverwaltung',
      subtitle: 'Vereinfachen Sie Ihre Geschäftsverwaltung mit unserer KI-gestützten Plattform. Finanzkontrolle, Bestandsverwaltung und personalisierte Empfehlungen an einem Ort.',
      cta: 'Kostenlos testen',
      secondaryCta: 'Mehr erfahren',
    },
    features: {
      title: 'Hauptfunktionen',
      inventory: {
        title: 'Bestandskontrolle',
        description: 'Verwalten Sie Ihren Bestand einfach, erhalten Sie intelligente Warnungen und optimieren Sie Ihre wöchentlichen Einkäufe auf Basis von Trends.'
      },
      financial: {
        title: 'Finanzverwaltung',
        description: 'Verfolgen Sie Einnahmen und Ausgaben, kategorisieren Sie Kosten und sehen Sie detaillierte Berichte, um Ihre Rentabilität zu verbessern.'
      },
      ai: {
        title: 'Künstliche Intelligenz',
        description: 'Erhalten Sie personalisierte Empfehlungen, Verkaufsprognosen und saisonale Analysen, die bei der Entscheidungsfindung helfen.'
      }
    },
    pricing: {
      title: 'Tarife und Preise',
      subtitle: 'Wählen Sie den Plan, der am besten zu Ihren Geschäftsanforderungen passt',
      recommended: 'Am beliebtesten',
      month: '/Monat',
      basic: 'Basis',
      professional: 'Professionell',
      premium: 'Premium',
      startNow: 'Jetzt starten',
      tryFree: 'Kostenlos testen',
      contactUs: 'Kontaktieren Sie uns',
      startButton: 'Jetzt starten',
      mostPopular: 'Am beliebtesten',
      enterprise: 'Enterprise'
    },
    login: {
      title: 'Bereits Kunde?',
      subtitle: 'Greifen Sie auf unsere Plattform zu, um Ihr Unternehmen zu verwalten',
      buttonText: 'Dashboard zugreifen'
    },
    newsletter: {
      title: 'Erhalten Sie unsere Updates',
      name: 'Name',
      email: 'E-Mail',
      subscribe: 'Abonnieren',
      successMessage: 'Vielen Dank für Ihr Abonnement unseres Newsletters!'
    }
  },
  'it-IT': {
    hero: {
      title: 'Gestione Intelligente del Business',
      subtitle: 'Semplifica l\'amministrazione della tua attività con la nostra piattaforma basata sull\'intelligenza artificiale. Controllo finanziario, gestione dell\'inventario e raccomandazioni personalizzate in un unico posto.',
      cta: 'Prova Gratuita',
      secondaryCta: 'Scopri di più',
    },
    features: {
      title: 'Funzionalità Principali',
      inventory: {
        title: 'Controllo Inventario',
        description: 'Gestisci il tuo stock facilmente, ricevi avvisi intelligenti e ottimizza i tuoi acquisti settimanali in base alle tendenze.'
      },
      financial: {
        title: 'Gestione Finanziaria',
        description: 'Traccia entrate e uscite, categorizza le spese e visualizza report dettagliati per migliorare la tua redditività.'
      },
      ai: {
        title: 'Intelligenza Artificiale',
        description: 'Ricevi consigli personalizzati, previsioni di vendita e analisi stagionali che aiutano nel processo decisionale.'
      }
    },
    pricing: {
      title: 'Piani e Prezzi',
      subtitle: 'Scegli il piano più adatto alle esigenze della tua attività',
      recommended: 'Più Popolare',
      month: '/mese',
      basic: 'Base',
      professional: 'Professionale',
      premium: 'Premium',
      startNow: 'Inizia Ora',
      tryFree: 'Prova Gratuita',
      contactUs: 'Contattaci',
      startButton: 'Inizia',
      mostPopular: 'Più Popolare',
      enterprise: 'Enterprise'
    },
    login: {
      title: 'Già cliente?',
      subtitle: 'Accedi alla nostra piattaforma per gestire la tua attività',
      buttonText: 'Accedi alla Dashboard'
    },
    newsletter: {
      title: 'Ricevi i nostri aggiornamenti',
      name: 'Nome',
      email: 'Email',
      subscribe: 'Iscriviti',
      successMessage: 'Grazie per esserti iscritto alla nostra newsletter!'
    }
  }
};

/**
 * Interface para o contexto de idioma
 * Interface for the language context
 */
interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: typeof translations;
}

/**
 * Cria o contexto de idioma
 * Creates the language context
 */
export const LanguageContext = createContext<LanguageContextType>({
  language: 'en-US',
  setLanguage: () => {},
  translations
});

// Also export the context as IdiomaContext for consistency
// Também exporta o contexto como IdiomaContext para consistência
export const IdiomaContext = LanguageContext;

/**
 * Interface para as propriedades do provedor de idioma
 * Interface for the language provider props
 */
interface LanguageProviderProps {
  children: ReactNode;
  value?: LanguageContextType;
}

/**
 * Provedor de contexto para idioma, gerencia o estado de idioma e fornece a tradução
 * Context provider for language, manages language state and provides translations
 */
export const LanguageProvider = ({ children, value }: LanguageProviderProps) => {
  const [language, setLanguage] = useState('en-US');

  // Detectar o idioma do navegador e definir como padrão
  useEffect(() => {
    // Apenas detectar o idioma se não estiver recebendo um valor externo
    if (!value) {
      const detectLanguage = () => {
        const browserLang = navigator.language;
        let selectedLang = 'en-US'; // Padrão inglês
        
        // Verificar se o idioma do navegador está entre os suportados
        if (browserLang.startsWith('pt')) {
          selectedLang = 'pt-BR';
        } else if (browserLang.startsWith('de')) {
          selectedLang = 'de-DE';
        } else if (browserLang.startsWith('it')) {
          selectedLang = 'it-IT';
        }
        
        setLanguage(selectedLang);
        // Sincronizar com i18n
        i18n.changeLanguage(selectedLang.split('-')[0]);
      };
      
      detectLanguage();
    }
  }, [value]);

  // Função para alterar o idioma e sincronizar com i18n
  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    // Sincronizar com i18n
    i18n.changeLanguage(lang.split('-')[0]);
  };

  // Usar valor externo se fornecido, caso contrário usar o estado interno
  const contextValue = value || { 
    language, 
    setLanguage: handleSetLanguage, 
    translations 
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export the same provider as IdiomaProvider for component consistency
// Exporta o mesmo provedor como IdiomaProvider para consistência de componentes
export const IdiomaProvider = LanguageProvider;

export default LanguageProvider; 