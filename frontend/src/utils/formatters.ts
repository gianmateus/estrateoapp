/**
 * Utilitários para formatação de dados na aplicação
 */

import i18n from '../i18n';

/**
 * Formata um valor numérico como moeda (EUR)
 * @param value - Valor a ser formatado
 * @param locale - Localidade para formatação (padrão: pt-BR)
 * @returns Valor formatado como moeda
 */
export const formatCurrency = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
 * Formata um valor numérico com separadores de milhares
 * @param value - Valor a ser formatado
 * @param locale - Localidade para formatação (padrão: pt-BR)
 * @returns Valor formatado com separadores
 */
export const formatNumber = (value: number, locale = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale).format(value);
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