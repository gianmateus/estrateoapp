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

// Resumo do inventário
router.get('/resumo', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.resumo);

// Exportar dados do inventário (em JSON ou CSV)
router.get('/exportar', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.exportar);

// Listar categorias disponíveis
router.get('/categorias', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.categorias);

// Buscar item por ID
router.get('/:id', permissionMiddleware.checkPermission(VIEW_INVENTORY_PERMISSION), inventarioController.buscarPorId);

// Adicionar novo item ao inventário
router.post('/', permissionMiddleware.checkPermission(CREATE_INVENTORY_PERMISSION), inventarioController.criar);

// Atualizar item do inventário
router.put('/:id', permissionMiddleware.checkPermission(EDIT_INVENTORY_PERMISSION), inventarioController.atualizar);

// Excluir item do inventário
router.delete('/:id', permissionMiddleware.checkPermission(DELETE_INVENTORY_PERMISSION), inventarioController.excluir);

export default router; 