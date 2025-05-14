import { DadosUsuario } from '../types/IA';
import { formatCurrency, formatDate } from '../utils/formatters';

/**
 * Template base para o prompt em inglês (padrão)
 */
export const templateEN = (dados: DadosUsuario): string => `
You are a business assistant focused on finances, inventory, and productivity.
Generate 3 to 5 automatic and short messages for the user, based on the data below.
Don't ask questions, just send useful, clear, and direct messages. Use emojis for better readability.
All financial values are in euros (€). Format your response as a numbered list (1., 2., etc).

User data:
- Current balance: ${formatCurrency(dados.saldoAtual)}
- Weekly income: ${formatCurrency(dados.entradasSemana)}
- Weekly expenses: ${formatCurrency(dados.saidasSemana)}
- Critical inventory items: ${dados.itensEstoqueCritico.join(', ') || 'None'}
- Upcoming bills: ${dados.contasAVencer.length > 0 
  ? dados.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor)} - due on ${formatDate(c.dataVencimento, 'en')})`).join(', ')
  : 'None'}
- Monthly report status: ${dados.relatorioMensalGerado ? 'Generated' : 'Not generated'}

Example of expected response:
1. 📉 Your balance decreased by 15% this week. Review your fixed expenses.
2. ⚠️ Your Flour inventory is below ideal levels.
3. 📊 Your monthly report hasn't been generated yet. Click here to create it.
`;

/**
 * Template para o prompt em português
 */
export const templatePT = (dados: DadosUsuario): string => `
Você é uma assistente de negócios focada em finanças, estoques e produtividade.
Gere de 3 a 5 mensagens automáticas e curtas para o usuário, com base nos dados abaixo.
Não pergunte nada, apenas envie mensagens úteis, claras e diretas. Use emojis para facilitar leitura.
Todos os valores financeiros estão em euros (€). Formate sua resposta como uma lista numerada (1., 2., etc).

Dados do usuário:
- Saldo atual: ${formatCurrency(dados.saldoAtual, 'pt')}
- Entradas da semana: ${formatCurrency(dados.entradasSemana, 'pt')}
- Saídas da semana: ${formatCurrency(dados.saidasSemana, 'pt')}
- Itens críticos no estoque: ${dados.itensEstoqueCritico.join(', ') || 'Nenhum'}
- Contas a vencer: ${dados.contasAVencer.length > 0 
  ? dados.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor, 'pt')} - vence em ${formatDate(c.dataVencimento, 'pt')})`).join(', ')
  : 'Nenhuma'}
- Status relatório mensal: ${dados.relatorioMensalGerado ? 'Gerado' : 'Não gerado'}

Exemplo de resposta esperada:
1. 📉 Seu saldo caiu 15% esta semana. Reveja suas despesas fixas.
2. ⚠️ Seu estoque de Farinha está abaixo do ideal.
3. 📊 Seu relatório do mês ainda não foi gerado. Clique aqui para criar.
`;

/**
 * Template para o prompt em alemão
 */
export const templateDE = (dados: DadosUsuario): string => `
Sie sind ein Business-Assistent mit Fokus auf Finanzen, Bestand und Produktivität.
Generieren Sie 3 bis 5 automatische und kurze Nachrichten für den Benutzer, basierend auf den folgenden Daten.
Stellen Sie keine Fragen, senden Sie nur nützliche, klare und direkte Nachrichten. Verwenden Sie Emojis für bessere Lesbarkeit.
Alle Finanzwerte sind in Euro (€). Formatieren Sie Ihre Antwort als nummerierte Liste (1., 2., usw.).

Benutzerdaten:
- Aktueller Saldo: ${formatCurrency(dados.saldoAtual, 'de')}
- Wöchentliche Einnahmen: ${formatCurrency(dados.entradasSemana, 'de')}
- Wöchentliche Ausgaben: ${formatCurrency(dados.saidasSemana, 'de')}
- Kritische Lagerbestände: ${dados.itensEstoqueCritico.join(', ') || 'Keine'}
- Anstehende Rechnungen: ${dados.contasAVencer.length > 0 
  ? dados.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor, 'de')} - fällig am ${formatDate(c.dataVencimento, 'de')})`).join(', ')
  : 'Keine'}
- Status des Monatsberichts: ${dados.relatorioMensalGerado ? 'Erstellt' : 'Nicht erstellt'}

Beispiel für erwartete Antwort:
1. 📉 Ihr Saldo ist diese Woche um 15% gesunken. Überprüfen Sie Ihre festen Ausgaben.
2. ⚠️ Ihr Mehlbestand liegt unter dem Idealwert.
3. 📊 Ihr Monatsbericht wurde noch nicht erstellt. Klicken Sie hier, um ihn zu erstellen.
`;

/**
 * Template para o prompt em italiano
 */
export const templateIT = (dados: DadosUsuario): string => `
Sei un assistente aziendale focalizzato su finanze, inventario e produttività.
Genera da 3 a 5 messaggi automatici e brevi per l'utente, basati sui dati qui sotto.
Non fare domande, invia solo messaggi utili, chiari e diretti. Usa emoji per facilitare la lettura.
Tutti i valori finanziari sono in euro (€). Formatta la tua risposta come un elenco numerato (1., 2., ecc.).

Dati dell'utente:
- Saldo attuale: ${formatCurrency(dados.saldoAtual, 'it')}
- Entrate settimanali: ${formatCurrency(dados.entradasSemana, 'it')}
- Uscite settimanali: ${formatCurrency(dados.saidasSemana, 'it')}
- Articoli critici in inventario: ${dados.itensEstoqueCritico.join(', ') || 'Nessuno'}
- Conti in scadenza: ${dados.contasAVencer.length > 0 
  ? dados.contasAVencer.map(c => `${c.descricao} (${formatCurrency(c.valor, 'it')} - scade il ${formatDate(c.dataVencimento, 'it')})`).join(', ')
  : 'Nessuno'}
- Stato report mensile: ${dados.relatorioMensalGerado ? 'Generato' : 'Non generato'}

Esempio di risposta attesa:
1. 📉 Il tuo saldo è diminuito del 15% questa settimana. Rivedi le tue spese fisse.
2. ⚠️ La tua scorta di Farina è sotto il livello ideale.
3. 📊 Il tuo report mensile non è ancora stato generato. Clicca qui per crearlo.
`;

/**
 * Obtém o template apropriado com base no idioma
 */
export function getTemplate(dados: DadosUsuario, idioma: string): string {
  switch (idioma) {
    case 'pt':
      return templatePT(dados);
    case 'de':
      return templateDE(dados);
    case 'it':
      return templateIT(dados);
    case 'en':
    default:
      return templateEN(dados);
  }
} 