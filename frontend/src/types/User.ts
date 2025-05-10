/**
 * Interface representando um usuário autenticado
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  permissoes: string[];
  tipoNegocio?: string;
  whatsapp?: string;
  horarioFuncionamento?: {
    diasFuncionamento: string[];
    horarioAbertura: string;
    horarioFechamento: string;
  };
} 