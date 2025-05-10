import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

/**
 * Middleware to check if user has the required permission
 * Allows access if user has the specified permission or is an admin
 * 
 * Middleware para verificar se o usuário possui a permissão necessária
 * Permite acesso se o usuário tiver a permissão especificada ou for administrador
 * 
 * @param permission - Required permission string or array of permissions (at least one)
 *                     String de permissão necessária ou array de permissões (pelo menos uma)
 */
export const checkPermission = (permission: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      // If no user ID is found in the request, authentication middleware was bypassed
      // Se não há ID de usuário na requisição, o middleware de autenticação foi ignorado
      if (!userId) {
        return res.status(401).json({
          error: true,
          message: 'Usuário não autenticado'
        });
      }
      
      // Get user with permissions from database
      // Obter usuário com permissões do banco de dados
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { permissoes: true }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Admin users have all permissions
      // Usuários administradores têm todas as permissões
      if (user.permissoes.includes('admin')) {
        return next();
      }
      
      // Check if user has at least one of the required permissions
      // Verificar se o usuário tem pelo menos uma das permissões necessárias
      const hasPermission = Array.isArray(permission)
        ? permission.some(perm => user.permissoes.includes(perm))
        : user.permissoes.includes(permission);
      
      if (!hasPermission) {
        return res.status(403).json({
          error: true,
          message: 'Permissão negada para esta operação'
        });
      }
      
      // User has required permission, proceed
      // Usuário tem permissão necessária, prosseguir
      next();
    } catch (error) {
      console.error('Erro no middleware de permissão:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor'
      });
    }
  };
};

/**
 * Middleware to check if user has all of the required permissions
 * Allows access if user has all specified permissions or is an admin
 * 
 * Middleware para verificar se o usuário possui todas as permissões necessárias
 * Permite acesso se o usuário tiver todas as permissões especificadas ou for administrador
 * 
 * @param permissions - Array of required permissions
 *                      Array de permissões necessárias
 */
export const checkAllPermissions = (permissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          error: true,
          message: 'Usuário não autenticado'
        });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { permissoes: true }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Admin users have all permissions
      // Usuários administradores têm todas as permissões
      if (user.permissoes.includes('admin')) {
        return next();
      }
      
      // Check if user has ALL required permissions
      // Verificar se o usuário tem TODAS as permissões necessárias
      const hasAllPermissions = permissions.every(perm => 
        user.permissoes.includes(perm)
      );
      
      if (!hasAllPermissions) {
        return res.status(403).json({
          error: true,
          message: 'Permissão negada para esta operação'
        });
      }
      
      next();
    } catch (error) {
      console.error('Erro no middleware de permissão:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro interno no servidor'
      });
    }
  };
};

export default {
  checkPermission,
  checkAllPermissions
}; 