import axios from 'axios';
import { config } from '../config';
import { formatCurrency } from '../utils/formatters';
import { DadosUsuario } from '../types/IA';

/**
 * Gera recomendações personalizadas usando a API do ChatGPT
 * @param dadosUsuario - Dados do usuário para análise
 * @param idioma - Idioma para a resposta (en, pt, de, it)
 * @returns Array de strings com recomendações
 */
export async function gerarRecomendacoes(dadosUsuario: DadosUsuario, idioma: string = 'en'): Promise<string[]> {
  try {
    const prompt = criarPrompt(dadosUsuario, idioma);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openai.apiKey}`
        }
      }
    );

    const conteudo = response.data.choices[0].message.content;
    // Extrair recomendações numeradas do conteúdo
    const recomendacoes = extrairRecomendacoes(conteudo);
    
    return recomendacoes;
  } catch (error) {
    console.error('Erro ao gerar recomendações com ChatGPT:', error);
    return gerarRecomendacoesFallback(dadosUsuario, idioma);
  }
}

/**
 * Extrai recomendações numeradas de um texto
 */
function extrairRecomendacoes(texto: string): string[] {
  // Regex para capturar itens numerados (1., 2., etc.) ou com emoji
  const regex = /(?:\d+\.\s|\-\s|•\s|[\p{Emoji}]+\s)(.+)/gu;
  const matches = [...texto.matchAll(regex)];
  
  if (matches.length === 0) {
    // Fallback: dividir o texto por linhas se não encontrou o padrão
    return texto.split('\n').filter(linha => linha.trim().length > 0);
  }
  
  return matches.map(match => match[0].trim());
}

/**
 * Gera recomendações de fallback em caso de erro na API
 */
function gerarRecomendacoesFallback(dadosUsuario: DadosUsuario, idioma: string): string[] {
  // Textos de fallback por idioma
  const fallbacks: Record<string, string[]> = {
    'en': [
      "📊 Remember to check your financial reports for this month.",
      "⚙️ Automate recurring tasks to improve your productivity.",
      "💰 Review your expenses to identify potential savings."
    ],
    'pt': [
      "📊 Lembre-se de verificar seus relatórios financeiros deste mês.",
      "⚙️ Automatize tarefas recorrentes para melhorar sua produtividade.",
      "💰 Revise suas despesas para identificar potenciais economias."
    ],
    'de': [
      "📊 Denken Sie daran, Ihre Finanzberichte für diesen Monat zu überprüfen.",
      "⚙️ Automatisieren Sie wiederkehrende Aufgaben, um Ihre Produktivität zu verbessern.",
      "💰 Überprüfen Sie Ihre Ausgaben, um mögliche Einsparungen zu identifizieren."
    ],
    'it': [
      "📊 Ricorda di controllare i tuoi rapporti finanziari per questo mese.",
      "⚙️ Automatizza le attività ricorrenti per migliorare la tua produttività.",
      "💰 Rivedi le tue spese per identificare potenziali risparmi."
    ]
  };
  
  return fallbacks[idioma] || fallbacks['en'];
}

/**
 * Cria o prompt para a API do ChatGPT com base nos dados do usuário
 */
function criarPrompt(dadosUsuario: DadosUsuario, idioma: string): string {
  const promptsBase: Record<string, string> = {
    'en': `You are a business assistant focused on finances, inventory, and productivity.
Generate 3 to 5 automatic and short messages for the user, based on the data below.
Don't ask questions, just send useful, clear, and direct messages. Use emojis for better readability.
All financial values are in euros (€). Format your response as a numbered list (1., 2., etc).

User data:
- Current balance: ${formatCurrency(dadosUsuario.saldoAtual)}
- Weekly income: ${formatCurrency(dadosUsuario.entradasSemana)}
- Weekly expenses: ${formatCurrency(dadosUsuario.saidasSemana)}
- Critical inventory items: ${dadosUsuario.itensEstoqueCritico.join(', ')}
- Upcoming bills: ${dadosUsuario.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor)} - due on ${c.dataVencimento})`).join(', ')}
- Monthly report status: ${dadosUsuario.relatorioMensalGerado ? 'Generated' : 'Not generated'}

Example of expected response:
1. 📉 Your balance decreased by 15% this week. Review your fixed expenses.
2. ⚠️ Your Flour inventory is below ideal levels.
3. 📊 Your monthly report hasn't been generated yet. Click here to create it.`,

    'pt': `Você é uma assistente de negócios focada em finanças, estoques e produtividade.
Gere de 3 a 5 mensagens automáticas e curtas para o usuário, com base nos dados abaixo.
Não pergunte nada, apenas envie mensagens úteis, claras e diretas. Use emojis para facilitar leitura.
Todos os valores financeiros estão em euros (€). Formate sua resposta como uma lista numerada (1., 2., etc).

Dados do usuário:
- Saldo atual: ${formatCurrency(dadosUsuario.saldoAtual)}
- Entradas da semana: ${formatCurrency(dadosUsuario.entradasSemana)}
- Saídas da semana: ${formatCurrency(dadosUsuario.saidasSemana)}
- Itens críticos no estoque: ${dadosUsuario.itensEstoqueCritico.join(', ')}
- Contas a vencer: ${dadosUsuario.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor)} - vence em ${c.dataVencimento})`).join(', ')}
- Status relatório mensal: ${dadosUsuario.relatorioMensalGerado ? 'Gerado' : 'Não gerado'}

Exemplo de resposta esperada:
1. 📉 Seu saldo caiu 15% esta semana. Reveja suas despesas fixas.
2. ⚠️ Seu estoque de Farinha está abaixo do ideal.
3. 📊 Seu relatório do mês ainda não foi gerado. Clique aqui para criar.`,

    'de': `Sie sind ein Business-Assistent mit Fokus auf Finanzen, Bestand und Produktivität.
Generieren Sie 3 bis 5 automatische und kurze Nachrichten für den Benutzer, basierend auf den folgenden Daten.
Stellen Sie keine Fragen, senden Sie nur nützliche, klare und direkte Nachrichten. Verwenden Sie Emojis für bessere Lesbarkeit.
Alle Finanzwerte sind in Euro (€). Formatieren Sie Ihre Antwort als nummerierte Liste (1., 2., usw.).

Benutzerdaten:
- Aktueller Saldo: ${formatCurrency(dadosUsuario.saldoAtual)}
- Wöchentliche Einnahmen: ${formatCurrency(dadosUsuario.entradasSemana)}
- Wöchentliche Ausgaben: ${formatCurrency(dadosUsuario.saidasSemana)}
- Kritische Lagerbestände: ${dadosUsuario.itensEstoqueCritico.join(', ')}
- Anstehende Rechnungen: ${dadosUsuario.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor)} - fällig am ${c.dataVencimento})`).join(', ')}
- Status des Monatsberichts: ${dadosUsuario.relatorioMensalGerado ? 'Erstellt' : 'Nicht erstellt'}

Beispiel für erwartete Antwort:
1. 📉 Ihr Saldo ist diese Woche um 15% gesunken. Überprüfen Sie Ihre festen Ausgaben.
2. ⚠️ Ihr Mehlbestand liegt unter dem Idealwert.
3. 📊 Ihr Monatsbericht wurde noch nicht erstellt. Klicken Sie hier, um ihn zu erstellen.`,

    'it': `Sei un assistente aziendale focalizzato su finanze, inventario e produttività.
Genera da 3 a 5 messaggi automatici e brevi per l'utente, basati sui dati qui sotto.
Non fare domande, invia solo messaggi utili, chiari e diretti. Usa emoji per facilitare la lettura.
Tutti i valori finanziari sono in euro (€). Formatta la tua risposta come un elenco numerato (1., 2., ecc.).

Dati dell'utente:
- Saldo attuale: ${formatCurrency(dadosUsuario.saldoAtual)}
- Entrate settimanali: ${formatCurrency(dadosUsuario.entradasSemana)}
- Uscite settimanali: ${formatCurrency(dadosUsuario.saidasSemana)}
- Articoli critici in inventario: ${dadosUsuario.itensEstoqueCritico.join(', ')}
- Conti in scadenza: ${dadosUsuario.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor)} - scade il ${c.dataVencimento})`).join(', ')}
- Stato report mensile: ${dadosUsuario.relatorioMensalGerado ? 'Generato' : 'Non generato'}

Esempio di risposta attesa:
1. 📉 Il tuo saldo è diminuito del 15% questa settimana. Rivedi le tue spese fisse.
2. ⚠️ La tua scorta di Farina è sotto il livello ideale.
3. 📊 Il tuo report mensile non è ancora stato generato. Clicca qui per crearlo.`
  };

  return promptsBase[idioma] || promptsBase['en'];
} 