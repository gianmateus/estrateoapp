import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { jwtConfig } from '../config';

// Estender a interface Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        nome: string;
        permissoes: string;
      };
    }
  }
}

/**
 * Middleware de autenticação JWT
 * 
 * Valida o token JWT presente no header Authorization
 * Verifica se o token está no formato correto (Bearer <token>)
 * Decodifica o token usando a chave JWT_SECRET do .env
 * Se válido, anexa os dados do usuário ao req.user
 * Se inválido, retorna status 401 Unauthorized
 */
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
        code: 'token_missing',
        message: 'Token não fornecido'
      });
    }
    
    // Verificar formato do token (Bearer token)
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2) {
      return res.status(401).json({
        error: true,
        code: 'token_format_invalid',
        message: 'Erro no formato do token'
      });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        error: true,
        code: 'token_schema_invalid',
        message: 'Token mal formatado'
      });
    }
    
    // Verificar se o token é válido
    const secret = jwtConfig.secret;
    
    if (!secret) {
      console.error('JWT_SECRET não definido no ambiente');
      return res.status(500).json({
        error: true,
        code: 'server_configuration_error',
        message: 'Erro de configuração do servidor'
      });
    }
    
    try {
      // Verificar e decodificar o token de forma síncrona
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      
      if (!decoded || typeof decoded !== 'object' || !decoded.id) {
        return res.status(401).json({
          error: true,
          code: 'token_payload_invalid',
          message: 'Payload do token inválido'
        });
      }
      
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return res.status(401).json({
          error: true,
          code: 'user_not_found',
          message: 'Usuário não encontrado'
        });
      }
      
      // Adicionar informações do usuário à requisição
      req.user = {
        id: user.id,
        email: user.email,
        nome: user.nome,
        permissoes: user.permissoes
      };
      
      return next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          error: true,
          code: 'token_expired',
          message: 'Token expirado'
        });
      }
      
      if (jwtError instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          error: true,
          code: 'token_invalid',
          message: 'Token inválido'
        });
      }
      
      // Outros erros de JWT
      return res.status(401).json({
        error: true,
        code: 'token_verification_failed',
        message: 'Falha na verificação do token'
      });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      error: true,
      code: 'server_error',
      message: 'Erro interno no servidor'
    });
  }
} 