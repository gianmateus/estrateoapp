import { Router } from 'express';
import { FuncionarioController, upload } from '../controllers/FuncionarioController';
import { ControleJornadaController } from '../controllers/ControleJornadaController';
import { ResumoPagamentoController } from '../controllers/ResumoPagamentoController';
import { FuncionarioService } from '../services/FuncionarioService';
import { ResumoPagamentoService } from '../services/ResumoPagamentoService';

const funcionarioRoutes = Router();
const funcionarioController = new FuncionarioController();
const controleJornadaController = new ControleJornadaController();
const resumoPagamentoController = new ResumoPagamentoController();

// Serviços diretos para uso na rota de relatório
// Direct services for use in the report route
const funcionarioService = new FuncionarioService();
const resumoPagamentoService = new ResumoPagamentoService();

// Rotas de Funcionários
// Employee Routes
funcionarioRoutes.post('/funcionarios', funcionarioController.create.bind(funcionarioController));
funcionarioRoutes.get('/funcionarios', funcionarioController.findAll.bind(funcionarioController));
funcionarioRoutes.get('/funcionarios/:id', funcionarioController.findById.bind(funcionarioController));
funcionarioRoutes.put('/funcionarios/:id', funcionarioController.update.bind(funcionarioController));
funcionarioRoutes.delete('/funcionarios/:id', funcionarioController.delete.bind(funcionarioController));
funcionarioRoutes.get('/funcionarios-por-tipo', funcionarioController.countByContractType.bind(funcionarioController));
funcionarioRoutes.post('/funcionarios/:id/contrato', upload.single('contrato'), funcionarioController.uploadContrato.bind(funcionarioController));
funcionarioRoutes.get('/funcionarios/:id/exportar-pdf', funcionarioController.generatePDF.bind(funcionarioController));

// Rotas de Controle de Jornada
// Workday Control Routes
funcionarioRoutes.post('/jornada', controleJornadaController.create.bind(controleJornadaController));
funcionarioRoutes.get('/jornada/:id', controleJornadaController.findById.bind(controleJornadaController));
funcionarioRoutes.get('/jornada/funcionario/:funcionarioId', controleJornadaController.findByFuncionarioId.bind(controleJornadaController));
funcionarioRoutes.put('/jornada/:id', controleJornadaController.update.bind(controleJornadaController));
funcionarioRoutes.delete('/jornada/:id', controleJornadaController.delete.bind(controleJornadaController));
funcionarioRoutes.get('/jornada/funcionario/:funcionarioId/horas-mensais', controleJornadaController.calcularHorasMensais.bind(controleJornadaController));

// Rotas de Resumo de Pagamento
// Payment Summary Routes
funcionarioRoutes.post('/resumo-pagamento', resumoPagamentoController.create.bind(resumoPagamentoController));
funcionarioRoutes.get('/resumo-pagamento/:id', resumoPagamentoController.findById.bind(resumoPagamentoController));
funcionarioRoutes.get('/resumo-pagamento/funcionario/:funcionarioId', resumoPagamentoController.findByFuncionarioEMes.bind(resumoPagamentoController));
funcionarioRoutes.get('/resumo-pagamento/mes/:mes', resumoPagamentoController.findByMes.bind(resumoPagamentoController));
funcionarioRoutes.put('/resumo-pagamento/:id', resumoPagamentoController.update.bind(resumoPagamentoController));
funcionarioRoutes.delete('/resumo-pagamento/:id', resumoPagamentoController.delete.bind(resumoPagamentoController));
funcionarioRoutes.post('/resumo-pagamento/:id/enviar-contador', resumoPagamentoController.marcarComoEnviado.bind(resumoPagamentoController));
funcionarioRoutes.post('/resumo-pagamento/funcionario/:funcionarioId/gerar', resumoPagamentoController.gerarResumoPagamento.bind(resumoPagamentoController));
funcionarioRoutes.post('/resumo-pagamento/mes/:mes/gerar-todos', resumoPagamentoController.gerarResumoTodosFuncionarios.bind(resumoPagamentoController));
funcionarioRoutes.get('/resumo-pagamento/mes/:mes/exportar-pdf', resumoPagamentoController.generatePDF.bind(resumoPagamentoController));

// Rota para relatório geral de funcionários
// General employee report route
funcionarioRoutes.get('/relatorio-funcionarios', async (req, res) => {
  try {
    const { mes } = req.query;
    
    if (!mes) {
      return res.status(400).json({ message: 'O parâmetro "mes" é obrigatório' });
    }
    
    // Busca todos os funcionários usando o serviço diretamente
    // Get all employees using the service directly
    const funcionarios = await funcionarioService.findAll({ status: 'ativo' });
    
    // Busca resumos de pagamento para o mês especificado
    // Get payment summaries for the specified month
    const resumos = await resumoPagamentoService.findByMes(String(mes));
    
    // Estrutura os dados do relatório
    // Structure report data
    const relatorio = {
      mes: String(mes),
      totalFuncionarios: funcionarios.length,
      totalAtivos: funcionarios.filter(f => f.status === 'ativo').length,
      porTipoContrato: await funcionarioService.countByContractType(),
      pagamentos: resumos,
      totalPagamentos: resumos.reduce((total, resumo) => total + resumo.salarioReal, 0),
      totalExtras: resumos.reduce((total, resumo) => total + (resumo.extras || 0), 0),
      geradoEm: new Date()
    };
    
    res.json(relatorio);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Erro ao gerar relatório'
    });
  }
});

export default funcionarioRoutes; 