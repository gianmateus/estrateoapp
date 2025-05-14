/**
 * Formata um valor monetário de acordo com o idioma, sempre em euros
 * @param value Valor numérico a formatar
 * @param locale Código do idioma (en, pt, de, it)
 * @returns String formatada (ex: €1,234.56 ou 1.234,56 €)
 */
export function formatCurrency(value: number, locale: string = 'en'): string {
  // Mapear códigos de idioma curtos para códigos completos com região
  const localeMap: Record<string, string> = {
    'en': 'en-GB', // Formato britânico para euro
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[locale] || locale;
  
  return new Intl.NumberFormat(formattingLocale, {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

/**
 * Formata uma data de acordo com o idioma
 * @param date Data a formatar
 * @param locale Código do idioma (en, pt, de, it)
 * @returns String formatada (ex: 12/31/2023 ou 31/12/2023)
 */
export function formatDate(date: Date | string, locale: string = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Mapear códigos de idioma curtos para códigos completos com região
  const localeMap: Record<string, string> = {
    'en': 'en-GB',
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[locale] || locale;
  
  return new Intl.DateTimeFormat(formattingLocale).format(dateObj);
}

/**
 * Formata um número de acordo com o idioma
 * @param value Valor numérico a formatar
 * @param locale Código do idioma (en, pt, de, it)
 * @returns String formatada (ex: 1,234.56 ou 1.234,56)
 */
export function formatNumber(value: number, locale: string = 'en'): string {
  // Mapear códigos de idioma curtos para códigos completos com região
  const localeMap: Record<string, string> = {
    'en': 'en-GB',
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[locale] || locale;
  
  return new Intl.NumberFormat(formattingLocale).format(value);
} 