import { Router } from 'express';
import userController from '../controllers/userController';
import { authMiddleware, permissionMiddleware } from '../middlewares';
import { 
  EDIT_PROFILE_PERMISSION,
  VIEW_PROFILE_PERMISSION,
  ADMIN_PERMISSION
} from '../constants/permissions';

const router = Router();

// Rotas públicas
router.post('/', userController.criar);

// Rotas protegidas por autenticação
router.use(authMiddleware);

// Rotas de perfil do usuário
router.get('/profile', permissionMiddleware.checkPermission(VIEW_PROFILE_PERMISSION), userController.getProfile);
router.put('/profile', permissionMiddleware.checkPermission(EDIT_PROFILE_PERMISSION), userController.updateProfile);
router.put('/change-password', permissionMiddleware.checkPermission(EDIT_PROFILE_PERMISSION), userController.changePassword);

// Rotas administrativas (gerenciar outros usuários)
router.get('/', permissionMiddleware.checkPermission(ADMIN_PERMISSION), userController.listar);
router.get('/:id', permissionMiddleware.checkPermission(ADMIN_PERMISSION), userController.buscarPorId);
router.put('/:id', permissionMiddleware.checkPermission(ADMIN_PERMISSION), userController.atualizar);
router.delete('/:id', permissionMiddleware.checkPermission(ADMIN_PERMISSION), userController.excluir);

export default router; 