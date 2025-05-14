/**
 * Utilitários para formatação de dados na aplicação
 */

import i18n from '../i18n';

/**
 * Formata um valor numérico como moeda em euro (€) de acordo com o idioma atual
 * @param value - Valor numérico a ser formatado
 * @param locale - Idioma a ser usado na formatação (padrão: idioma atual do i18n)
 * @returns String formatada com o valor em euro
 */
export const formatCurrency = (value: number, locale?: string): string => {
  const currentLocale = locale || i18n.language;
  
  // Mapeia códigos de idioma curtos para códigos completos se necessário
  const localeMap: { [key: string]: string } = {
    'en': 'en-GB', // Formato britânico para euro
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[currentLocale] || currentLocale;
  
  return new Intl.NumberFormat(formattingLocale, {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

/**
 * Formata uma data de acordo com o idioma atual
 * @param date - Data a ser formatada (Date, string ou timestamp)
 * @param locale - Idioma a ser usado na formatação (padrão: idioma atual do i18n)
 * @param options - Opções adicionais de formatação
 * @returns String formatada com a data
 */
export const formatDate = (
  date: Date | string | number,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const currentLocale = locale || i18n.language;
  
  // Mapeia códigos de idioma curtos para códigos completos se necessário
  const localeMap: { [key: string]: string } = {
    'en': 'en-GB',
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[currentLocale] || currentLocale;
  const dateObject = date instanceof Date ? date : new Date(date);
  
  return new Intl.DateTimeFormat(
    formattingLocale,
    options || { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }
  ).format(dateObject);
};

/**
 * Formata um valor numérico de acordo com o idioma atual
 * @param value - Valor numérico a ser formatado
 * @param locale - Idioma a ser usado na formatação (padrão: idioma atual do i18n)
 * @returns String formatada com o valor numérico
 */
export const formatNumber = (value: number, locale?: string): string => {
  const currentLocale = locale || i18n.language;
  
  // Mapeia códigos de idioma curtos para códigos completos se necessário
  const localeMap: { [key: string]: string } = {
    'en': 'en-GB',
    'pt': 'pt-BR',
    'de': 'de-DE',
    'it': 'it-IT'
  };
  
  const formattingLocale = localeMap[currentLocale] || currentLocale;
  
  return new Intl.NumberFormat(formattingLocale).format(value);
};

/**
 * Formata um valor numérico como porcentagem
 * @param value - Valor a ser formatado (exemplo: 0.35 para 35%)
 * @param locale - Localidade para formatação (padrão: pt-BR)
 * @returns Valor formatado como porcentagem
 */
export const formatPercent = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}; 