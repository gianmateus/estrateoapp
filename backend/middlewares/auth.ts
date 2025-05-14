import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Estender a interface Request para incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        permissoes: string;
      };
    }
  }
}

/**
 * Middleware para autenticar usuários
 * Verifica se o token JWT é válido
 */
export function autenticarUsuario(req: Request, res: Response, next: NextFunction): void {
  try {
    // Obtém o token do header de autorização
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token de autenticação não fornecido' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Em um sistema real, verificaria o token JWT aqui
    // Por simplicidade, apenas simulamos a verificação
    if (token === 'INVALID_TOKEN') {
      res.status(401).json({ error: 'Token de autenticação inválido' });
      return;
    }
    
    // Adiciona o usuário ao objeto request para uso posterior
    (req as any).user = {
      id: '123456', // Exemplo de ID
      email: 'usuario@exemplo.com'
    };
    
    // Continua para o próximo middleware/controller
    next();
  } catch (erro) {
    logger.error('Erro durante autenticação:', erro);
    res.status(500).json({ error: 'Erro interno durante autenticação' });
  }
}

/**
 * Middleware para verificar se o usuário está autenticado via JWT
 * @param req Requisição Express
 * @param res Resposta Express
 * @param next Função para continuar para o próximo middleware
 */
export const autenticarToken = (req: Request, res: Response, next: NextFunction) => {
  // Obter token do cabeçalho Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ mensagem: 'Token de autenticação não fornecido' });
  }
  
  try {
    // Verificar o token usando o segredo da aplicação
    const segredo = process.env.JWT_SECRET || 'segredo_desenvolvimento';
    const decoded = jwt.verify(token, segredo) as { id: string; email: string; permissoes: string };
    
    // Adicionar usuário à requisição
    req.user = {
      id: decoded.id,
      email: decoded.email,
      permissoes: decoded.permissoes
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado' });
  }
}; 