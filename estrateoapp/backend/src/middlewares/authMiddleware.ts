import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

// Estender a interface Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Obter o cabeçalho de autorização
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: true,
        message: 'Token não fornecido'
      });
    }
    
    // Verificar formato do token (Bearer token)
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({
        error: true,
        message: 'Erro no formato do token'
      });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: true,
        message: 'Token mal formatado'
      });
    }
    
    // Verificar se o token é válido
    const secret = process.env.JWT_SECRET || 'chave_secreta_jwt_estrateo';
    
    jwt.verify(token, secret, async (err, decoded: any) => {
      if (err) {
        return res.status(401).json({
          error: true,
          message: 'Token inválido ou expirado'
        });
      }
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return res.status(401).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Adicionar informações do usuário à requisição
      req.user = {
        id: user.id,
        email: user.email
      };
      
      return next();
    });
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      error: true,
      message: 'Erro interno no servidor'
    });
  }
} 