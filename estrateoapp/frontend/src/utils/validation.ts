/**
 * Utilitários de validação para o sistema de gestão de restaurante
 */
import { sanitizeInput, validateEmail, validateNumericValue, validateDate, containsMaliciousCode } from './security';

/**
 * Interface para resultados de validação
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Valida campos de texto genéricos
 * @param value Valor a ser validado
 * @param fieldName Nome do campo para mensagem de erro
 * @param options Opções de validação
 * @returns Resultado da validação
 */
export const validateTextField = (
  value: string,
  fieldName: string,
  options: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    patternMessage?: string;
  } = {}
): ValidationResult => {
  const { required = true, minLength, maxLength, pattern, patternMessage } = options;
  
  // Sanitizar entrada
  const sanitizedValue = sanitizeInput(value);
  
  // Verificar se é obrigatório
  if (required && (!sanitizedValue || sanitizedValue.trim() === '')) {
    return { isValid: false, message: `O campo ${fieldName} é obrigatório` };
  }
  
  // Verificar comprimento mínimo
  if (minLength !== undefined && sanitizedValue.length < minLength) {
    return { isValid: false, message: `O campo ${fieldName} deve ter pelo menos ${minLength} caracteres` };
  }
  
  // Verificar comprimento máximo
  if (maxLength !== undefined && sanitizedValue.length > maxLength) {
    return { isValid: false, message: `O campo ${fieldName} deve ter no máximo ${maxLength} caracteres` };
  }
  
  // Verificar padrão
  if (pattern && !pattern.test(sanitizedValue)) {
    return { isValid: false, message: patternMessage || `O campo ${fieldName} não está no formato correto` };
  }
  
  // Verificar código malicioso
  if (containsMaliciousCode(sanitizedValue)) {
    return { isValid: false, message: `O campo ${fieldName} contém caracteres não permitidos` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Valida campos de email
 * @param email Email a ser validado
 * @param required Se o campo é obrigatório
 * @returns Resultado da validação
 */
export const validateEmailField = (email: string, required: boolean = true): ValidationResult => {
  // Verificar se é obrigatório
  if (required && (!email || email.trim() === '')) {
    return { isValid: false, message: 'O campo de email é obrigatório' };
  }
  
  // Se não for obrigatório e estiver vazio, é válido
  if (!required && (!email || email.trim() === '')) {
    return { isValid: true, message: '' };
  }
  
  // Validar formato do email
  if (!validateEmail(email)) {
    return { isValid: false, message: 'Email inválido' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Valida campos numéricos
 * @param value Valor a ser validado
 * @param fieldName Nome do campo para mensagem de erro
 * @param options Opções de validação
 * @returns Resultado da validação
 */
export const validateNumberField = (
  value: string | number,
  fieldName: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): ValidationResult => {
  const { required = true, min, max, integer = false } = options;
  
  // Verificar se é obrigatório
  if (required && (value === undefined || value === null || value === '')) {
    return { isValid: false, message: `O campo ${fieldName} é obrigatório` };
  }
  
  // Se não for obrigatório e estiver vazio, é válido
  if (!required && (value === undefined || value === null || value === '')) {
    return { isValid: true, message: '' };
  }
  
  // Converter para número
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Verificar se é um número válido
  if (isNaN(numValue)) {
    return { isValid: false, message: `O campo ${fieldName} deve ser um número válido` };
  }
  
  // Verificar se é inteiro quando necessário
  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, message: `O campo ${fieldName} deve ser um número inteiro` };
  }
  
  // Verificar valor mínimo
  if (min !== undefined && numValue < min) {
    return { isValid: false, message: `O campo ${fieldName} deve ser maior ou igual a ${min}` };
  }
  
  // Verificar valor máximo
  if (max !== undefined && numValue > max) {
    return { isValid: false, message: `O campo ${fieldName} deve ser menor ou igual a ${max}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Valida campos de data
 * @param date Data a ser validada
 * @param fieldName Nome do campo para mensagem de erro
 * @param options Opções de validação
 * @returns Resultado da validação
 */
export const validateDateField = (
  date: Date | string,
  fieldName: string,
  options: {
    required?: boolean;
    minDate?: Date;
    maxDate?: Date;
  } = {}
): ValidationResult => {
  const { required = true, minDate, maxDate } = options;
  
  // Verificar se é obrigatório
  if (required && !date) {
    return { isValid: false, message: `O campo ${fieldName} é obrigatório` };
  }
  
  // Se não for obrigatório e estiver vazio, é válido
  if (!required && !date) {
    return { isValid: true, message: '' };
  }
  
  // Converter para objeto Date se for string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Verificar se é uma data válida
  if (!validateDate(dateObj)) {
    return { isValid: false, message: `O campo ${fieldName} deve ser uma data válida` };
  }
  
  // Verificar data mínima
  if (minDate && dateObj < minDate) {
    return { isValid: false, message: `O campo ${fieldName} deve ser posterior a ${minDate.toLocaleDateString()}` };
  }
  
  // Verificar data máxima
  if (maxDate && dateObj > maxDate) {
    return { isValid: false, message: `O campo ${fieldName} deve ser anterior a ${maxDate.toLocaleDateString()}` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Valida um formulário completo
 * @param validations Array de resultados de validação
 * @returns Resultado da validação do formulário
 */
export const validateForm = (validations: ValidationResult[]): ValidationResult => {
  const invalidFields = validations.filter(v => !v.isValid);
  
  if (invalidFields.length > 0) {
    return {
      isValid: false,
      message: invalidFields[0].message // Retorna a primeira mensagem de erro
    };
  }
  
  return { isValid: true, message: '' };
};