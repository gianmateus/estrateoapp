import { Router } from 'express';
import { ClienteController } from '../controllers/ClienteController';
import { InteracaoClienteController } from '../controllers/InteracaoClienteController';
import { DocumentoClienteController, upload } from '../controllers/DocumentoClienteController';
import { authMiddleware } from '../../../middlewares/authMiddleware';

const router = Router();
const clienteController = new ClienteController();
const interacaoClienteController = new InteracaoClienteController();
const documentoClienteController = new DocumentoClienteController();

// Middleware de autenticação para todas as rotas
router.use(authMiddleware);

// Rotas para clientes
// Client routes
router.post('/clientes', (req, res) => clienteController.create(req, res));
router.put('/clientes/:id', (req, res) => clienteController.update(req, res));
router.get('/clientes/:id', (req, res) => clienteController.findById(req, res));
router.get('/clientes', (req, res) => clienteController.findAll(req, res));
router.delete('/clientes/:id', (req, res) => clienteController.delete(req, res));
router.get('/clientes-busca', (req, res) => clienteController.search(req, res));
router.get('/clientes-por-status', (req, res) => clienteController.countByStatus(req, res));
router.get('/clientes-por-tipo', (req, res) => clienteController.countByType(req, res));

// Rotas para interações com clientes
// Client interaction routes
router.post('/interacoes', (req, res) => interacaoClienteController.create(req, res));
router.put('/interacoes/:id', (req, res) => interacaoClienteController.update(req, res));
router.get('/interacoes/:id', (req, res) => interacaoClienteController.findById(req, res));
router.get('/clientes/:clienteId/interacoes', (req, res) => interacaoClienteController.findByClienteId(req, res));
router.delete('/interacoes/:id', (req, res) => interacaoClienteController.delete(req, res));
router.get('/interacoes-periodo', (req, res) => interacaoClienteController.findByPeriod(req, res));
router.get('/proximas-acoes', (req, res) => interacaoClienteController.findNextActions(req, res));

// Rotas para documentos de clientes
// Client document routes
router.post('/documentos/upload', upload.single('arquivo'), (req, res) => documentoClienteController.upload(req, res));
router.put('/documentos/:id', (req, res) => documentoClienteController.update(req, res));
router.get('/documentos/:id', (req, res) => documentoClienteController.findById(req, res));
router.get('/documentos/:id/download', (req, res) => documentoClienteController.download(req, res));
router.get('/clientes/:clienteId/documentos', (req, res) => documentoClienteController.findByClienteId(req, res));
router.delete('/documentos/:id', (req, res) => documentoClienteController.delete(req, res));
router.get('/documentos-tipo/:tipo', (req, res) => documentoClienteController.findByType(req, res));

export default router; 