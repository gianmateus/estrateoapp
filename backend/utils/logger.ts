/**
 * Utilitário de logger para o backend
 */
export const logger = {
  /**
   * Registra uma mensagem informativa
   */
  info(message: string, ...optionalParams: any[]): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  },
  
  /**
   * Registra uma mensagem de erro
   */
  error(message: string, ...optionalParams: any[]): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  },
  
  /**
   * Registra uma mensagem de aviso
   */
  warn(message: string, ...optionalParams: any[]): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  },
  
  /**
   * Registra uma mensagem de depuração
   * Só exibe se o ambiente for de desenvolvimento
   */
  debug(message: string, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...optionalParams);
    }
  }
}; 