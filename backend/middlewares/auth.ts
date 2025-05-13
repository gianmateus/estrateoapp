import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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