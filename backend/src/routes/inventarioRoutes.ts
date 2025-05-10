import { Router } from 'express';
import inventarioController from '../controllers/inventarioController';
import { permissionMiddleware } from '../middlewares';
import { 
  VIEW_INVENTORY_PERMISSION, 
  CREATE_INVENTORY_PERMISSION, 
  EDIT_INVENTORY_PERMISSION, 
  DELETE_INVENTORY_PERMISSION 
} from '../constants/permissions';

const router = Router();

// Listar todos os itens do inventário
router.get('/', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.listar);

// Resumo dos itens do inventário para dashboard
router.get('/resumo', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.resumo);

// Sugestões de itens abaixo do ideal
router.get('/sugestoes', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.sugestoes);

// Buscar item por ID
router.get('/:id', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.buscarPorId);

// Criar novo item
router.post('/', permissionMiddleware.checkPermission(CREATE_INVENTORY_PERMISSION), inventarioController.criar);

// Atualizar item
router.put('/:id', permissionMiddleware.checkPermission(EDIT_INVENTORY_PERMISSION), inventarioController.atualizar);

// Excluir item
router.delete('/:id', permissionMiddleware.checkPermission(DELETE_INVENTORY_PERMISSION), inventarioController.excluir);

export default router; 