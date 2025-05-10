/**
 * Serviço para integração com a API do ChatGPT via servidor proxy
 */

const API_URL = '/api/openai/chat'; // Rota do proxy no servidor
const STATUS_URL = '/api/status'; // Rota de status do servidor
const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hora em milissegundos

// Cache para armazenar respostas e reduzir chamadas à API
interface CacheItem {
  data: string;
  timestamp: number;
}

interface ServerInfo {
  status: string;
  message: string;
  config: {
    rateLimit: string;
    authentication: string;
    cacheEnabled: boolean;
    cacheItems: number;
  };
}

const cache: Record<string, CacheItem> = {};

interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
}

interface APIError {
  error: {
    message: string;
    type: string;
    code?: number;
  }
}

interface PrevisaoVendas {
  date: string;
  predicted_sales: number;
}

interface PrevisaoEstoque {
  item_id: string;
  item_name: string;
  current_quantity: number;
  recommended_quantity: number;
}

interface PrevisaoFinanceira {
  date: string;
  predicted_income: number;
  predicted_expenses: number;
}

interface Recomendacao {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

interface DadosSazonalidade {
  period: string;
  value: number;
  category: string;
}

// Métricas de uso
interface UsageMetrics {
  totalRequests: number;
  totalTokensUsed: number;
  lastRequest: Date | null;
  lastModelUsed: string | null;
}

const usageMetrics: UsageMetrics = {
  totalRequests: 0,
  totalTokensUsed: 0,
  lastRequest: null,
  lastModelUsed: null
};

// Função auxiliar para gerar chaves de cache consistentes
const generateCacheKey = (model: string, prompt: string): string => {
  return `${model}:${prompt}`;
};

// Função para verificar se uma chave existe no cache e não está expirada
const getCachedResponse = (key: string): string | null => {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_EXPIRATION) {
    console.log('Usando resposta em cache para:', key.substring(0, 50) + '...');
    return item.data;
  }
  return null;
};

// Função auxiliar para verificar se o erro é recuperável
const isRecoverableError = (error: any): boolean => {
  // Erros de rede ou timeout são recuperáveis
  if (!error.response) {
    return true;
  }
  
  // Erros 5xx são recuperáveis (problemas de servidor)
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }
  
  // Erros de rate limit (429) podem ser recuperáveis após espera
  if (error.response.status === 429) {
    return true;
  }
  
  // Outros erros (400, 401, 403) não são recuperáveis por novas tentativas
  return false;
};

// Função auxiliar para verificar conexão com o servidor
const checkServerConnection = async (): Promise<ServerInfo> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(STATUS_URL, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Erro ao verificar status do servidor: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Erro ao verificar conexão com o servidor:', error);
    throw new Error('Servidor de IA não está respondendo');
  }
};

const ChatGPTService = {
  // Obter métricas de uso
  getUsageMetrics(): UsageMetrics {
    return { ...usageMetrics };
  },
  
  // Verificar se o servidor está disponível
  async verificarConfiguracao(): Promise<ServerInfo> {
    try {
      const serverInfo = await checkServerConnection();
      return serverInfo;
    } catch (error) {
      console.error('Erro ao verificar servidor:', error);
      throw new Error('Servidor de IA não está respondendo');
    }
  },
  
  // Função genérica de chamada à API com cache, retry e tratamento de erros robusto
  async callChatGPTAPI(prompt: string, model: string = 'gpt-3.5-turbo', maxRetries: number = 2): Promise<string> {
    // Verificar cache
    const cacheKey = generateCacheKey(model, prompt);
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Verificar conexão com o servidor
    try {
      await checkServerConnection();
    } catch (error) {
      throw new Error('Servidor de IA não está disponível. Verifique sua conexão e tente novamente.');
    }

    // Tentativas com backoff exponencial
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Incrementar contadores de uso
        usageMetrics.totalRequests++;
        usageMetrics.lastRequest = new Date();
        usageMetrics.lastModelUsed = model;
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'Você é um assistente especializado em análise de dados e previsões para negócios de restaurantes.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 1000
          })
        });

        if (!response.ok) {
          let errorData: APIError;
          try {
            errorData = await response.json();
          } catch {
            errorData = {
              error: {
                message: `Erro ${response.status}: ${response.statusText}`,
                type: 'unknown_error',
                code: response.status
              }
            };
          }
          
          const errorMessage = errorData.error?.message || 'Erro desconhecido';
          
          // Verificar se devemos tentar novamente
          if (!isRecoverableError(response) || attempt >= maxRetries) {
            throw new Error(errorMessage);
          }
          
          // Esperar antes de tentar novamente
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.warn(`Erro recuperável (${response.status}). Tentando novamente em ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }

        const data: ChatGPTResponse = await response.json();
        const result = data.choices[0].message.content;
        
        // Atualizar métricas de uso
        if (data.usage) {
          usageMetrics.totalTokensUsed += data.usage.total_tokens;
        }
        
        // Armazenar no cache
        cache[cacheKey] = {
          data: result,
          timestamp: Date.now()
        };
        
        return result;
      } catch (error) {
        console.error(`Tentativa ${attempt + 1}/${maxRetries + 1} falhou:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Se não for um erro recuperável ou se for a última tentativa, desistir
        if (!(error instanceof Error) || !isRecoverableError(error) || attempt >= maxRetries) {
          break;
        }
        
        // Caso contrário, aguardar antes de tentar novamente
        const backoffTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
    
    throw lastError || new Error('Falha ao comunicar com o servidor de IA após múltiplas tentativas');
  },

  // Limpar cache
  clearCache(): void {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
    console.log('Cache limpo');
  },
  
  // Métodos para previsões
  previsoes: {
    async callChatGPT(prompt: string): Promise<string> {
      return ChatGPTService.callChatGPTAPI(prompt);
    },

    async obterPrevisaoVendas(tipoNegocio: string, dados: any): Promise<PrevisaoVendas[]> {
      const prompt = `Com base nos dados fornecidos, faça uma previsão de vendas para os próximos 7 dias para um ${tipoNegocio}. 
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as previsões no formato: [{"date": "YYYY-MM-DD", "predicted_sales": number}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter previsão de vendas:', error);
        throw new Error('Não foi possível gerar a previsão de vendas. Tente novamente mais tarde.');
      }
    },

    async obterPrevisaoEstoque(tipoNegocio: string, dados: any): Promise<PrevisaoEstoque[]> {
      const prompt = `Com base nos dados fornecidos, faça uma previsão de estoque para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as previsões no formato: [{"item_id": string, "item_name": string, "current_quantity": number, "recommended_quantity": number}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter previsão de estoque:', error);
        throw new Error('Não foi possível gerar a previsão de estoque. Tente novamente mais tarde.');
      }
    },

    async obterPrevisaoFinanceira(tipoNegocio: string, dados: any): Promise<PrevisaoFinanceira[]> {
      const prompt = `Com base nos dados fornecidos, faça uma previsão financeira para os próximos 30 dias para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as previsões no formato: [{"date": "YYYY-MM-DD", "predicted_income": number, "predicted_expenses": number}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter previsão financeira:', error);
        throw new Error('Não foi possível gerar a previsão financeira. Tente novamente mais tarde.');
      }
    }
  },

  // Métodos para recomendações
  recomendacoes: {
    async callChatGPT(prompt: string): Promise<string> {
      return ChatGPTService.callChatGPTAPI(prompt);
    },

    async obterRecomendacoesNegocio(tipoNegocio: string, dados: any): Promise<Recomendacao[]> {
      const prompt = `Com base nos dados fornecidos, faça recomendações de negócio para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as recomendações no formato: [{"id": string, "title": string, "description": string, "impact": "high" | "medium" | "low", "category": string}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter recomendações de negócio:', error);
        throw new Error('Não foi possível gerar recomendações para o negócio. Tente novamente mais tarde.');
      }
    },

    async obterRecomendacoesEstoque(tipoNegocio: string, dados: any): Promise<Recomendacao[]> {
      const prompt = `Com base nos dados fornecidos, faça recomendações de estoque para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as recomendações no formato: [{"id": string, "title": string, "description": string, "impact": "high" | "medium" | "low", "category": string}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter recomendações de estoque:', error);
        throw new Error('Não foi possível gerar recomendações para o estoque. Tente novamente mais tarde.');
      }
    },

    async obterRecomendacoesFinanceiras(tipoNegocio: string, dados: any): Promise<Recomendacao[]> {
      const prompt = `Com base nos dados fornecidos, faça recomendações financeiras para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com as recomendações no formato: [{"id": string, "title": string, "description": string, "impact": "high" | "medium" | "low", "category": string}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter recomendações financeiras:', error);
        throw new Error('Não foi possível gerar recomendações financeiras. Tente novamente mais tarde.');
      }
    }
  },

  // Métodos para sazonalidade
  sazonalidade: {
    async callChatGPT(prompt: string): Promise<string> {
      return ChatGPTService.callChatGPTAPI(prompt);
    },
    
    async obterDadosSazonalidade(tipoNegocio: string, dados: any): Promise<DadosSazonalidade[]> {
      const prompt = `Com base nos dados fornecidos, faça uma análise sazonal para um ${tipoNegocio}.
      Dados: ${JSON.stringify(dados)}
      Retorne apenas um array JSON com os dados no formato: [{"period": string, "value": number, "category": string}]`;
      
      try {
        const response = await this.callChatGPT(prompt);
        return JSON.parse(response);
      } catch (error) {
        console.error('Erro ao obter dados de sazonalidade:', error);
        throw new Error('Não foi possível gerar a análise de sazonalidade. Tente novamente mais tarde.');
      }
    }
  },
};

export default ChatGPTService; 