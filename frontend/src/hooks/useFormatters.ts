import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate, formatNumber } from '../utils/formatters';

/**
 * Hook que fornece funções de formatação baseadas no idioma atual
 */
const useFormatters = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;

  return {
    /**
     * Formata um valor numérico como moeda em euro (€) de acordo com o idioma atual
     * @param value - Valor numérico a ser formatado
     * @returns String formatada com o valor em euro
     */
    formatCurrency: (value: number) => formatCurrency(value, currentLocale),

    /**
     * Formata um valor numérico de acordo com o idioma atual
     * @param value - Valor numérico a ser formatado
     * @returns String formatada com o valor numérico
     */
    formatNumber: (value: number) => formatNumber(value, currentLocale),

    /**
     * Formata uma data de acordo com o idioma atual
     * @param date - Data a ser formatada (Date, string ou timestamp)
     * @param options - Opções adicionais de formatação
     * @returns String formatada com a data
     */
    formatDate: (
      date: Date | string | number,
      options?: Intl.DateTimeFormatOptions
    ) => formatDate(date, currentLocale, options),

    /**
     * Retorna o locale atual
     */
    getCurrentLocale: () => currentLocale
  };
};

export default useFormatters; 