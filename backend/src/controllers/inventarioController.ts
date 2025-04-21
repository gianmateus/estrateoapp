import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const inventarioController = {
  // Listar todos os itens do inventário do usuário
  async listar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      const itens = await prisma.inventario.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return res.status(200).json(itens);
    } catch (error) {
      console.error('Erro ao listar inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar itens do inventário' 
      });
    }
  },

  // Buscar item por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const item = await prisma.inventario.findFirst({
        where: { 
          id,
          userId 
        }
      });
      
      if (!item) {
        return res.status(404).json({ 
          error: true, 
          message: 'Item não encontrado' 
        });
      }
      
      return res.status(200).json(item);
    } catch (error) {
      console.error('Erro ao buscar item do inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar item do inventário' 
      });
    }
  },

  // Criar novo item no inventário
  async criar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { nome, categoria, unidade, quantidadeAtual, quantidadeIdeal } = req.body;
      
      // Validações básicas
      if (!nome || !categoria || !unidade || quantidadeAtual === undefined || quantidadeIdeal === undefined) {
        return res.status(400).json({
          error: true,
          message: 'Dados incompletos. Informe nome, categoria, unidade, quantidade atual e quantidade ideal'
        });
      }
      
      // Validar se as quantidades são números positivos
      if (isNaN(quantidadeAtual) || isNaN(quantidadeIdeal) || quantidadeAtual < 0 || quantidadeIdeal < 0) {
        return res.status(400).json({
          error: true,
          message: 'As quantidades devem ser números positivos'
        });
      }
      
      // Criar item
      const item = await prisma.inventario.create({
        data: {
          nome,
          categoria,
          unidade,
          quantidadeAtual: Number(quantidadeAtual),
          quantidadeIdeal: Number(quantidadeIdeal),
          userId
        }
      });
      
      return res.status(201).json({
        message: 'Item adicionado ao inventário',
        item
      });
    } catch (error) {
      console.error('Erro ao criar item no inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao criar item no inventário' 
      });
    }
  },

  // Atualizar item do inventário
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { nome, categoria, unidade, quantidadeAtual, quantidadeIdeal } = req.body;
      
      // Verificar se o item existe e pertence ao usuário
      const itemExistente = await prisma.inventario.findFirst({
        where: { 
          id,
          userId 
        }
      });
      
      if (!itemExistente) {
        return res.status(404).json({
          error: true,
          message: 'Item não encontrado'
        });
      }
      
      // Preparar dados para atualização
      const dadosAtualizacao: any = {};
      
      if (nome) dadosAtualizacao.nome = nome;
      if (categoria) dadosAtualizacao.categoria = categoria;
      if (unidade) dadosAtualizacao.unidade = unidade;
      if (quantidadeAtual !== undefined) {
        if (isNaN(quantidadeAtual) || quantidadeAtual < 0) {
          return res.status(400).json({
            error: true,
            message: 'A quantidade atual deve ser um número positivo'
          });
        }
        dadosAtualizacao.quantidadeAtual = Number(quantidadeAtual);
      }
      if (quantidadeIdeal !== undefined) {
        if (isNaN(quantidadeIdeal) || quantidadeIdeal < 0) {
          return res.status(400).json({
            error: true,
            message: 'A quantidade ideal deve ser um número positivo'
          });
        }
        dadosAtualizacao.quantidadeIdeal = Number(quantidadeIdeal);
      }
      
      // Atualizar item
      const itemAtualizado = await prisma.inventario.update({
        where: { id },
        data: dadosAtualizacao
      });
      
      return res.status(200).json({
        message: 'Item atualizado com sucesso',
        item: itemAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar item do inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao atualizar item do inventário' 
      });
    }
  },

  // Excluir item do inventário
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Verificar se o item existe e pertence ao usuário
      const itemExistente = await prisma.inventario.findFirst({
        where: { 
          id,
          userId 
        }
      });
      
      if (!itemExistente) {
        return res.status(404).json({
          error: true,
          message: 'Item não encontrado'
        });
      }
      
      // Excluir item
      await prisma.inventario.delete({
        where: { id }
      });
      
      return res.status(200).json({
        message: 'Item excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir item do inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao excluir item do inventário' 
      });
    }
  },

  // Resumo do inventário com itens abaixo do ideal
  async resumo(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      // Buscar todos os itens do usuário
      const itens = await prisma.inventario.findMany({
        where: {
          userId
        }
      });
      
      // Calcular itens abaixo do ideal
      const itensCriticos = itens.filter(item => 
        item.quantidadeAtual < item.quantidadeIdeal
      ).length;
      
      // Calcular valor total do inventário (simulação)
      const valorTotal = itens.reduce((acc, item) => acc + (item.quantidadeAtual * 10), 0);
      
      return res.json({
        itensCriticos,
        totalItens: itens.length,
        valorTotal
      });
    } catch (error) {
      console.error('Erro ao buscar resumo do inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar resumo do inventário' 
      });
    }
  },
  
  // Sugestões de reabastecimento (itens abaixo do ideal)
  async sugestoes(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      // Buscar itens abaixo do ideal
      const itensCriticos = await prisma.inventario.findMany({
        where: {
          userId,
          quantidadeAtual: {
            lt: prisma.inventario.fields.quantidadeIdeal
          }
        }
      });
      
      return res.json({
        itensCriticos: itensCriticos.length,
        itens: itensCriticos
      });
    } catch (error) {
      console.error('Erro ao buscar sugestões de inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar sugestões de inventário' 
      });
    }
  }
};

export default inventarioController; 