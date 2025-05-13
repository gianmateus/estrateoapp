/**
 * Controlador para o módulo Contador
 * 
 * Gerencia:
 * - Cálculos fiscais para o mercado alemão e europeu
 * - Geração de relatórios no padrão ELSTER
 * - Exportação de dados no formato XBRL
 * - Preparação de relatórios contábeis conformes com as normas da UE
 */

import { Request, Response } from 'express';
import ContadorService from '../services/ContadorService';
import { TaxEngine } from '../services/TaxEngine';

class ContadorController {
  /**
   * Obtém dados financeiros para um período específico
   */
  async getDadosFinanceiros(req: Request, res: Response) {
    try {
      const { periodo } = req.params;
      
      // Validar período (formato AAAA-MM)
      const periodoRegex = /^\d{4}-\d{2}$/;
      if (!periodoRegex.test(periodo)) {
        return res.status(400).json({ 
          erro: 'Formato de período inválido. Use AAAA-MM' 
        });
      }

      // Obter dados do serviço
      const contadorService = new ContadorService();
      const dados = await contadorService.getDadosFinanceiros(periodo);

      return res.json(dados);
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      return res.status(500).json({ 
        erro: 'Erro ao processar a requisição',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Calcula impostos alemães para um conjunto de dados financeiros
   */
  async calcularImpostosAlemanha(req: Request, res: Response) {
    try {
      const { receita, despesas, periodo } = req.body;

      // Validar dados de entrada
      if (typeof receita !== 'number' || typeof despesas !== 'number') {
        return res.status(400).json({ 
          erro: 'Dados financeiros inválidos. Receita e despesas devem ser números.' 
        });
      }

      // Calcular impostos utilizando o TaxEngine
      const taxEngine = new TaxEngine();
      const resultadoImpostos = taxEngine.calcularImpostosAlemanha({
        receita,
        despesas,
        periodo
      });

      return res.json(resultadoImpostos);
    } catch (error) {
      console.error('Erro ao calcular impostos:', error);
      return res.status(500).json({ 
        erro: 'Erro ao processar cálculos de impostos',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Gera um relatório no formato ELSTER (sistema fiscal alemão)
   */
  async gerarRelatorioELSTER(req: Request, res: Response) {
    try {
      const { periodo, dados } = req.body;

      // Validar período e dados
      if (!periodo || !dados) {
        return res.status(400).json({ 
          erro: 'Período e dados financeiros são obrigatórios' 
        });
      }

      // Instanciar serviço e gerar relatório
      const contadorService = new ContadorService();
      const relatorio = await contadorService.gerarElsterReport(periodo, dados);

      // Enviar relatório como download
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=ELSTER_${periodo}.xml`);
      return res.send(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório ELSTER:', error);
      return res.status(500).json({ 
        erro: 'Erro ao gerar relatório ELSTER',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Gera um relatório no formato XBRL (eXtensible Business Reporting Language)
   */
  async gerarRelatorioXBRL(req: Request, res: Response) {
    try {
      const { periodo, dados, tipoRelatorio } = req.body;

      // Validar dados de entrada
      if (!periodo || !dados) {
        return res.status(400).json({ 
          erro: 'Período e dados financeiros são obrigatórios' 
        });
      }

      // Tipo de relatório deve ser um dos valores permitidos
      const tiposPermitidos = ['anual', 'trimestral', 'mensal'];
      const tipo = tipoRelatorio || 'mensal';
      
      if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({ 
          erro: 'Tipo de relatório inválido. Use: anual, trimestral ou mensal' 
        });
      }

      // Instanciar serviço e gerar relatório
      const contadorService = new ContadorService();
      const relatorio = await contadorService.gerarXBRLReport(periodo, dados, tipo);

      // Enviar relatório como download
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Content-Disposition', `attachment; filename=XBRL_${tipo}_${periodo}.xml`);
      return res.send(relatorio);
    } catch (error) {
      console.error('Erro ao gerar relatório XBRL:', error);
      return res.status(500).json({ 
        erro: 'Erro ao gerar relatório XBRL',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Gera relatório financeiro padrão adaptado para o mercado europeu
   */
  async gerarRelatorioPDF(req: Request, res: Response) {
    try {
      const { periodo, idioma } = req.query;
      
      // Validar período
      if (!periodo) {
        return res.status(400).json({ erro: 'Período é obrigatório' });
      }

      // Definir idioma (padrão é português)
      const idiomaRelatorio = idioma || 'pt';

      // Instanciar serviço e gerar relatório
      const contadorService = new ContadorService();
      const pdfBuffer = await contadorService.gerarRelatorioPDF(
        periodo as string, 
        idiomaRelatorio as string
      );

      // Enviar PDF como download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Relatorio_${periodo}.pdf`);
      return res.send(pdfBuffer);
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
      return res.status(500).json({ 
        erro: 'Erro ao gerar relatório PDF',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Configurações de impostos por tipo de produto/serviço
   */
  async getConfiguracoesImposto(req: Request, res: Response) {
    try {
      // Instanciar serviço e obter configurações
      const contadorService = new ContadorService();
      const configuracoes = await contadorService.getConfiguracoesImposto();

      return res.json(configuracoes);
    } catch (error) {
      console.error('Erro ao obter configurações de impostos:', error);
      return res.status(500).json({ 
        erro: 'Erro ao obter configurações de impostos',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  /**
   * Atualiza configurações de impostos por tipo de produto/serviço
   */
  async atualizarConfiguracoesImposto(req: Request, res: Response) {
    try {
      const { configuracoes } = req.body;

      if (!configuracoes) {
        return res.status(400).json({ erro: 'Configurações são obrigatórias' });
      }

      // Validar estrutura das configurações
      if (!Array.isArray(configuracoes)) {
        return res.status(400).json({ 
          erro: 'Formato inválido para configurações. Deve ser um array.' 
        });
      }

      // Instanciar serviço e atualizar configurações
      const contadorService = new ContadorService();
      await contadorService.atualizarConfiguracoesImposto(configuracoes);

      return res.json({ 
        mensagem: 'Configurações de impostos atualizadas com sucesso' 
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações de impostos:', error);
      return res.status(500).json({ 
        erro: 'Erro ao atualizar configurações de impostos',
        detalhes: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }
}

export default new ContadorController(); 