import { Router } from 'express';
import pagamentoController from '../controllers/pagamentoController';
import { permissionMiddleware } from '../middlewares';
import { 
  VIEW_PAYMENTS_PERMISSION, 
  CREATE_PAYMENT_PERMISSION, 
  EDIT_PAYMENT_PERMISSION, 
  DELETE_PAYMENT_PERMISSION 
} from '../constants/permissions';

const router = Router();

// Resumo de pagamentos para o dashboard
router.get('/resumo', permissionMiddleware.checkPermission(VIEW_PAYMENTS_PERMISSION), pagamentoController.resumo);

// Listar todos os pagamentos do usuário
router.get('/', permissionMiddleware.checkPermission(VIEW_PAYMENTS_PERMISSION), pagamentoController.listar);

// Buscar pagamento por ID
router.get('/:id', permissionMiddleware.checkPermission(VIEW_PAYMENTS_PERMISSION), pagamentoController.buscarPorId);

// Criar novo pagamento
router.post('/', permissionMiddleware.checkPermission(CREATE_PAYMENT_PERMISSION), pagamentoController.criar);

// Atualizar pagamento existente
router.put('/:id', permissionMiddleware.checkPermission(EDIT_PAYMENT_PERMISSION), pagamentoController.atualizar);

// Excluir pagamento
router.delete('/:id', permissionMiddleware.checkPermission(DELETE_PAYMENT_PERMISSION), pagamentoController.excluir);

export default router; 