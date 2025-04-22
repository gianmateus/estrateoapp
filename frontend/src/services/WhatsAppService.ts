/**
 * Serviço para integração com WhatsApp e gestão de mensagens
 */

import i18n from '../i18n';

// Para desenvolvimento, simulamos as chamadas de API
// Em produção, seria necessário utilizar um serviço de mensagens real como Twilio ou API oficial do WhatsApp Business
interface Mensagem {
  id: string;
  telefone: string;
  texto: string;
  timestamp: Date;
  enviada: boolean;
  erro?: string;
}

interface RegistroDiario {
  data: string;
  faturamento: number;
  descricao: string;
  observacoes: string;
}

// Cache de mensagens para simulação
let mensagensCache: Mensagem[] = [];
let registrosDiarios: RegistroDiario[] = [];

// Formatar número de telefone para o formato padrão
const formatarNumeroTelefone = (numero: string): string => {
  // Remove caracteres não numéricos
  const apenasNumeros = numero.replace(/\D/g, '');
  
  // Verifica se o número está no formato correto
  if (apenasNumeros.length < 10 || apenasNumeros.length > 13) {
    throw new Error('Número de telefone inválido. Deve conter DDD e número.');
  }
  
  // Adiciona código do país se não existir
  let numeroFormatado = apenasNumeros;
  if (numeroFormatado.length === 10 || numeroFormatado.length === 11) {
    numeroFormatado = `55${numeroFormatado}`;
  }
  
  return numeroFormatado;
};

// Verifica se é hora de enviar a mensagem de fechamento
const verificarHorarioEnvio = (
  horarioAtual: Date, 
  horarioFechamento: string, 
  diasFuncionamento: string[]
): boolean => {
  const diaSemanaAtual = [
    'domingo', 
    'segunda-feira', 
    'terça-feira', 
    'quarta-feira', 
    'quinta-feira', 
    'sexta-feira', 
    'sábado'
  ][horarioAtual.getDay()];
  
  // Verifica se hoje é dia de funcionamento
  if (!diasFuncionamento.includes(diaSemanaAtual)) {
    return false;
  }
  
  // Extrai hora e minuto do horário de fechamento
  const [horaFechamento, minutoFechamento] = horarioFechamento.split(':').map(Number);
  
  // Horário atual
  const horaAtual = horarioAtual.getHours();
  const minutoAtual = horarioAtual.getMinutes();
  
  // Verifica se estamos no horário de fechamento (considera uma margem de 30 minutos após o fechamento)
  return (
    (horaAtual === horaFechamento && minutoAtual >= minutoFechamento) || 
    (horaAtual === horaFechamento + 1 && minutoAtual < 30)
  );
};

const WhatsAppService = {
  // Envia mensagem via WhatsApp
  async enviarMensagem(telefone: string, texto: string): Promise<Mensagem> {
    try {
      const numeroFormatado = formatarNumeroTelefone(telefone);
      
      // Simulação de envio - em produção, chamaríamos a API real
      console.log(`Enviando mensagem para ${numeroFormatado}: ${texto}`);
      
      // Simula atraso de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Gera um ID único para a mensagem
      const novaMensagem: Mensagem = {
        id: `msg_${Date.now()}`,
        telefone: numeroFormatado,
        texto,
        timestamp: new Date(),
        enviada: true
      };
      
      // Armazena no cache
      mensagensCache.push(novaMensagem);
      
      return novaMensagem;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Registra mensagem com erro
      const mensagemErro: Mensagem = {
        id: `msg_${Date.now()}`,
        telefone,
        texto,
        timestamp: new Date(),
        enviada: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
      
      mensagensCache.push(mensagemErro);
      throw error;
    }
  },
  
  // Envia mensagem perguntando sobre o faturamento diário
  async enviarPerguntaFaturamento(telefone: string): Promise<Mensagem> {
    // Usar o idioma atual do i18n ou PT como fallback
    const language = i18n?.language || 'pt-BR';
    const dataHoje = new Intl.DateTimeFormat(language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date());
    
    const texto = `Olá! O restaurante fechou por hoje (${dataHoje}). Poderia informar o faturamento total do dia? Por favor, responda com o valor e uma breve descrição.`;
    
    return this.enviarMensagem(telefone, texto);
  },
  
  // Registra o faturamento diário no sistema
  async registrarFaturamentoDiario(data: string, faturamento: number, descricao: string, observacoes: string): Promise<RegistroDiario> {
    const novoRegistro: RegistroDiario = {
      data,
      faturamento,
      descricao,
      observacoes
    };
    
    // Verifica se já existe um registro para esta data
    const indiceExistente = registrosDiarios.findIndex(r => r.data === data);
    
    if (indiceExistente >= 0) {
      // Atualiza registro existente
      registrosDiarios[indiceExistente] = novoRegistro;
    } else {
      // Adiciona novo registro
      registrosDiarios.push(novoRegistro);
    }
    
    return novoRegistro;
  },
  
  // Verifica se é hora de enviar mensagem de fechamento e envia se necessário
  async verificarEEnviarMensagemFechamento(
    telefone: string, 
    horarioFechamento: string, 
    diasFuncionamento: string[]
  ): Promise<Mensagem | null> {
    const agora = new Date();
    
    if (verificarHorarioEnvio(agora, horarioFechamento, diasFuncionamento)) {
      // Verifica se já enviamos mensagem hoje
      const hoje = agora.toISOString().split('T')[0];
      const jaEnviouHoje = mensagensCache.some(m => 
        m.timestamp.toISOString().split('T')[0] === hoje && 
        m.telefone === formatarNumeroTelefone(telefone)
      );
      
      // Se não enviou hoje, envia agora
      if (!jaEnviouHoje) {
        return this.enviarPerguntaFaturamento(telefone);
      }
    }
    
    return null;
  },
  
  // Retorna histórico de mensagens
  getMensagens(): Mensagem[] {
    return [...mensagensCache];
  },
  
  // Retorna histórico de registros diários
  getRegistrosDiarios(): RegistroDiario[] {
    return [...registrosDiarios];
  }
};

export default WhatsAppService; 