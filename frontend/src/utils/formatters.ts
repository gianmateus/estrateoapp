/**
 * Utilitários para formatação de dados na aplicação
 */

import i18n from '../i18n';

/**
 * Formata um valor numérico como moeda no formato europeu (EUR)
 * @param value Valor numérico a ser formatado
 * @returns String formatada no padrão europeu (ex: € 1.234,56)
 */
export const formatCurrency = (value: number): string => {
  // Usar i18n.language quando disponível ou usar locale padrão
  const language = i18n?.language || 'de-DE';
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

/**
 * Formata uma data no padrão europeu
 * @param date Data a ser formatada
 * @returns String formatada de acordo com o idioma atual
 */
export const formatDate = (date: Date | string): string => {
  // Usar i18n.language quando disponível ou usar locale padrão
  const language = i18n?.language || 'de-DE';
  
  // Converter para objeto Date se for string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(language);
};

/**
 * Formata um número no padrão europeu (com ponto para milhar e vírgula para decimal)
 * @param value Valor numérico
 * @param decimals Número de casas decimais
 * @returns String formatada
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  // Usar i18n.language quando disponível ou usar locale padrão
  const language = i18n?.language || 'de-DE';
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Formata um valor como percentual
 * @param value Valor numérico a ser formatado (0.1 = 10%)
 * @returns String formatada como percentual (ex: 10%)
 */
export const formatPercentage = (value: number): string => {
  // Usar i18n.language quando disponível ou usar locale padrão
  const language = i18n?.language || 'de-DE';
  return new Intl.NumberFormat(language, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value);
}; 