import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { EventBus } from '../lib/EventBus';

class PagamentoController {
  // Listar pagamentos do usuário autenticado
  async listar(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const pagamentos = await prisma.pagamento.findMany({
        where: {
          userId
        },
        orderBy: {
          vencimento: 'asc'
        }
      });

      return res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Criar novo pagamento
  async criar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { descricao, valor, categoria, vencimento, pago } = req.body;

      // Validação básica
      if (!descricao || valor === undefined || !categoria || !vencimento) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
      }

      // Criar pagamento
      const pagamento = await prisma.pagamento.create({
        data: {
          descricao,
          valor: parseFloat(valor),
          categoria,
          vencimento: new Date(vencimento),
          pago: pago || false,
          userId
        }
      });

      // Emitir evento de pagamento criado para sincronização entre módulos
      EventBus.emit('pagamento.criado', {
        id: pagamento.id,
        descricao: pagamento.descricao,
        valor: pagamento.valor,
        data: pagamento.vencimento,
        status: pagamento.pago ? 'pago' : 'pendente',
        tipo: pagamento.categoria,
        userId: pagamento.userId
      });

      return res.status(201).json(pagamento);
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Atualizar pagamento existente
  async atualizar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { descricao, valor, categoria, vencimento, pago } = req.body;

      // Verificar se o pagamento existe e pertence ao usuário
      const pagamentoExistente = await prisma.pagamento.findUnique({
        where: { id }
      });

      if (!pagamentoExistente) {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }

      if (pagamentoExistente.userId !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para editar este pagamento' });
      }

      // Atualizar pagamento
      const pagamentoAtualizado = await prisma.pagamento.update({
        where: { id },
        data: {
          descricao,
          valor: parseFloat(valor),
          categoria,
          vencimento: new Date(vencimento),
          pago: pago !== undefined ? pago : pagamentoExistente.pago
        }
      });

      // Emitir evento de pagamento atualizado para sincronização entre módulos
      EventBus.emit('pagamento.atualizado', {
        id: pagamentoAtualizado.id,
        descricao: pagamentoAtualizado.descricao,
        valor: pagamentoAtualizado.valor,
        data: pagamentoAtualizado.vencimento,
        status: pagamentoAtualizado.pago ? 'pago' : 'pendente',
        tipo: pagamentoAtualizado.categoria,
        userId: pagamentoAtualizado.userId
      });

      return res.json(pagamentoAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar pagamento:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Excluir pagamento
  async excluir(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verificar se o pagamento existe e pertence ao usuário
      const pagamentoExistente = await prisma.pagamento.findUnique({
        where: { id }
      });

      if (!pagamentoExistente) {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }

      if (pagamentoExistente.userId !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para excluir este pagamento' });
      }

      // Excluir pagamento
      await prisma.pagamento.delete({
        where: { id }
      });

      // Emitir evento de pagamento excluído para sincronização entre módulos
      EventBus.emit('pagamento.excluido', id);

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Buscar pagamento por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const pagamento = await prisma.pagamento.findUnique({
        where: { id }
      });

      if (!pagamento) {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }

      if (pagamento.userId !== userId) {
        return res.status(403).json({ message: 'Você não tem permissão para acessar este pagamento' });
      }

      return res.json(pagamento);
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Resumo de pagamentos para o dashboard
  async resumo(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      // Buscar todos os pagamentos do usuário
      const pagamentos = await prisma.pagamento.findMany({
        where: {
          userId
        }
      });

      // Calcular o resumo
      const pagos = pagamentos.filter(pag => pag.pago).length;
      const pendentes = pagamentos.filter(pag => !pag.pago).length;
      const total = pagamentos.length;

      return res.json({
        pagos,
        pendentes,
        total
      });
    } catch (error) {
      console.error('Erro ao gerar resumo de pagamentos:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new PagamentoController(); 