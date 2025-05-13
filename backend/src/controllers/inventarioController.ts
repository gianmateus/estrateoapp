import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { EventBus } from '../lib/EventBus';
import { Prisma } from '../generated/prisma';

const inventarioController = {
  // Listar todos os itens do inventário do usuário com paginação, filtros e ordenação
  async listar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      // Parâmetros de paginação
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      
      // Parâmetros de ordenação
      const sortBy = (req.query.sortBy as string) || 'nome';
      const sortOrder = (req.query.sortOrder as string) || 'asc';
      
      // Parâmetros de filtro
      const nome = req.query.nome as string;
      const codigoEAN = req.query.codigoEAN as string;
      const fornecedor = req.query.fornecedor as string;
      const categoria = req.query.categoria as string;
      const estoqueMinimo = req.query.estoqueMinimo === 'true';
      const validade = req.query.validade as string;
      
      // Construir filtro
      const where: Prisma.InventarioWhereInput = {
        userId,
        ...(nome && { nome: { contains: nome, mode: 'insensitive' } }),
        ...(codigoEAN && { codigoEAN: { contains: codigoEAN } }),
        ...(fornecedor && { fornecedor: { contains: fornecedor, mode: 'insensitive' } }),
        ...(categoria && { categoria: { equals: categoria } }),
        ...(estoqueMinimo && { 
          AND: [
            { nivelMinimoEstoque: { not: null } },
            { quantidade: { lte: { path: ['nivelMinimoEstoque'] } } }
          ]
        }),
        ...(validade && { 
          dataValidade: { 
            lte: new Date(new Date().setDate(new Date().getDate() + parseInt(validade))) 
          } 
        }),
      };
      
      // Construir ordenação
      const orderBy: any = {};
      orderBy[sortBy] = sortOrder;
      
      // Contar total de itens
      const total = await prisma.inventario.count({ where });
      
      // Buscar itens paginados
      const itens = await prisma.inventario.findMany({
        where,
        orderBy,
        skip,
        take: limit
      });
      
      return res.status(200).json({
        itens,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
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
      const { 
        nome, 
        quantidade, 
        preco,
        codigoEAN,
        fornecedor,
        precoCompra,
        unidadeMedida,
        dataValidade,
        nivelMinimoEstoque,
        localizacaoArmazem,
        categoria,
        descricao,
        foto
      } = req.body;
      
      // Validações básicas
      if (!nome || quantidade === undefined || preco === undefined) {
        return res.status(400).json({
          error: true,
          message: 'Dados incompletos. Informe nome, quantidade e preço.'
        });
      }
      
      // Validar se as quantidades e preços são números positivos
      if (isNaN(quantidade) || quantidade < 0) {
        return res.status(400).json({
          error: true,
          message: 'A quantidade deve ser um número positivo'
        });
      }
      
      if (isNaN(preco) || preco < 0) {
        return res.status(400).json({
          error: true,
          message: 'O preço deve ser um número positivo'
        });
      }
      
      if (precoCompra !== undefined && (isNaN(precoCompra) || precoCompra < 0)) {
        return res.status(400).json({
          error: true,
          message: 'O preço de compra deve ser um número positivo'
        });
      }
      
      if (nivelMinimoEstoque !== undefined && (isNaN(nivelMinimoEstoque) || nivelMinimoEstoque < 0)) {
        return res.status(400).json({
          error: true,
          message: 'O nível mínimo de estoque deve ser um número positivo'
        });
      }
      
      // Validação da data de validade
      let validadeDate = null;
      if (dataValidade) {
        validadeDate = new Date(dataValidade);
        if (isNaN(validadeDate.getTime())) {
          return res.status(400).json({
            error: true,
            message: 'Data de validade inválida'
          });
        }
      }
      
      // Criar item
      const item = await prisma.inventario.create({
        data: {
          nome,
          quantidade: Number(quantidade),
          preco: Number(preco),
          codigoEAN,
          fornecedor,
          precoCompra: precoCompra ? Number(precoCompra) : null,
          unidadeMedida: unidadeMedida || 'unidade',
          dataValidade: validadeDate,
          nivelMinimoEstoque: nivelMinimoEstoque ? Number(nivelMinimoEstoque) : null,
          localizacaoArmazem,
          categoria,
          descricao,
          foto,
          userId
        }
      });
      
      // Verificar se o item está abaixo do mínimo
      if (nivelMinimoEstoque && quantidade < nivelMinimoEstoque) {
        EventBus.emit('estoque.item.abaixo.minimo', {
          id: item.id,
          nome: item.nome,
          categoria: item.categoria,
          quantidade: item.quantidade,
          nivelMinimo: item.nivelMinimoEstoque,
          unidadeMedida: item.unidadeMedida
        });
      }
      
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
      const { 
        nome, 
        quantidade, 
        preco,
        codigoEAN,
        fornecedor,
        precoCompra,
        unidadeMedida,
        dataValidade,
        nivelMinimoEstoque,
        localizacaoArmazem,
        categoria,
        descricao,
        foto
      } = req.body;
      
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
      
      // Validação da data de validade
      let validadeDate = undefined;
      if (dataValidade) {
        validadeDate = new Date(dataValidade);
        if (isNaN(validadeDate.getTime())) {
          return res.status(400).json({
            error: true,
            message: 'Data de validade inválida'
          });
        }
      }
      
      // Preparar dados para atualização
      const dadosAtualizacao: any = {};
      
      if (nome !== undefined) dadosAtualizacao.nome = nome;
      if (quantidade !== undefined) {
        if (isNaN(quantidade) || quantidade < 0) {
          return res.status(400).json({
            error: true,
            message: 'A quantidade deve ser um número positivo'
          });
        }
        dadosAtualizacao.quantidade = Number(quantidade);
      }
      if (preco !== undefined) {
        if (isNaN(preco) || preco < 0) {
          return res.status(400).json({
            error: true,
            message: 'O preço deve ser um número positivo'
          });
        }
        dadosAtualizacao.preco = Number(preco);
      }
      if (codigoEAN !== undefined) dadosAtualizacao.codigoEAN = codigoEAN;
      if (fornecedor !== undefined) dadosAtualizacao.fornecedor = fornecedor;
      if (precoCompra !== undefined) {
        if (isNaN(precoCompra) || precoCompra < 0) {
          return res.status(400).json({
            error: true,
            message: 'O preço de compra deve ser um número positivo'
          });
        }
        dadosAtualizacao.precoCompra = Number(precoCompra);
      }
      if (unidadeMedida !== undefined) dadosAtualizacao.unidadeMedida = unidadeMedida;
      if (dataValidade !== undefined) dadosAtualizacao.dataValidade = validadeDate;
      if (nivelMinimoEstoque !== undefined) {
        if (isNaN(nivelMinimoEstoque) || nivelMinimoEstoque < 0) {
          return res.status(400).json({
            error: true,
            message: 'O nível mínimo de estoque deve ser um número positivo'
          });
        }
        dadosAtualizacao.nivelMinimoEstoque = Number(nivelMinimoEstoque);
      }
      if (localizacaoArmazem !== undefined) dadosAtualizacao.localizacaoArmazem = localizacaoArmazem;
      if (categoria !== undefined) dadosAtualizacao.categoria = categoria;
      if (descricao !== undefined) dadosAtualizacao.descricao = descricao;
      if (foto !== undefined) dadosAtualizacao.foto = foto;
      
      // Atualizar item
      const itemAtualizado = await prisma.inventario.update({
        where: { id },
        data: dadosAtualizacao
      });

      // Emitir evento de movimentação de estoque se a quantidade foi alterada
      if (quantidade !== undefined && itemExistente.quantidade !== Number(quantidade)) {
        const diferencaQuantidade = Number(quantidade) - itemExistente.quantidade;
        const tipo = diferencaQuantidade > 0 ? 'entrada' : 'saida';
        
        // Calcular valor da movimentação com base no preço de compra
        const valorPorUnidade = itemAtualizado.precoCompra || itemAtualizado.preco;
        const valorMovimentacao = Math.abs(diferencaQuantidade) * valorPorUnidade;
        
        EventBus.emit('estoque.movimentado', {
          id: `mov-${Date.now()}`,
          itemId: itemAtualizado.id,
          itemNome: itemAtualizado.nome,
          quantidade: Math.abs(diferencaQuantidade),
          tipo,
          valor: valorMovimentacao,
          data: new Date(),
          responsavel: userId
        });
      }
      
      // Verificar se o item está abaixo do mínimo após atualização
      if (itemAtualizado.nivelMinimoEstoque && itemAtualizado.quantidade < itemAtualizado.nivelMinimoEstoque) {
        EventBus.emit('estoque.item.abaixo.minimo', {
          id: itemAtualizado.id,
          nome: itemAtualizado.nome,
          categoria: itemAtualizado.categoria,
          quantidade: itemAtualizado.quantidade,
          nivelMinimo: itemAtualizado.nivelMinimoEstoque,
          unidadeMedida: itemAtualizado.unidadeMedida
        });
      }
      
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

  // Resumo do inventário com estatísticas
  async resumo(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      // Buscar todos os itens do usuário
      const itens = await prisma.inventario.findMany({
        where: {
          userId
        }
      });
      
      // Calcular itens abaixo do mínimo
      const itensCriticos = itens.filter(item => 
        item.nivelMinimoEstoque !== null && item.quantidade < item.nivelMinimoEstoque
      ).length;
      
      // Calcular valor total do inventário
      const valorTotalCompra = itens.reduce((acc, item) => 
        acc + (item.quantidade * (item.precoCompra || 0)), 0
      );
      
      const valorTotalVenda = itens.reduce((acc, item) => 
        acc + (item.quantidade * item.preco), 0
      );
      
      // Itens com validade próxima (30 dias)
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() + 30);
      
      const itensValidadeProxima = itens.filter(item => 
        item.dataValidade && item.dataValidade <= dataLimite
      ).length;
      
      // Contagem por categoria
      const categorias = itens.reduce((acc: Record<string, number>, item) => {
        const categoria = item.categoria || 'Sem categoria';
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {});
      
      return res.json({
        totalItens: itens.length,
        itensCriticos,
        itensValidadeProxima,
        valorTotalCompra,
        valorTotalVenda,
        lucroPotencial: valorTotalVenda - valorTotalCompra,
        categorias
      });
    } catch (error) {
      console.error('Erro ao buscar resumo do inventário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar resumo do inventário' 
      });
    }
  },
  
  // Exportar dados do inventário
  async exportar(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const formato = (req.query.formato as string) || 'json';
      
      // Buscar itens do usuário
      const itens = await prisma.inventario.findMany({
        where: {
          userId
        },
        orderBy: {
          nome: 'asc'
        }
      });
      
      if (formato === 'csv') {
        // Preparar dados para CSV
        const headers = 'ID,Nome,Quantidade,Preço Venda,Preço Compra,Código EAN,Fornecedor,Unidade de Medida,Data de Validade,Nível Mínimo,Localização,Categoria\n';
        
        const rows = itens.map(item => {
          const dataValidade = item.dataValidade ? new Date(item.dataValidade).toLocaleDateString() : '';
          
          return [
            item.id,
            item.nome,
            item.quantidade,
            item.preco,
            item.precoCompra || '',
            item.codigoEAN || '',
            item.fornecedor || '',
            item.unidadeMedida,
            dataValidade,
            item.nivelMinimoEstoque || '',
            item.localizacaoArmazem || '',
            item.categoria || ''
          ].join(',');
        }).join('\n');
        
        const csv = headers + rows;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=inventario.csv');
        
        return res.status(200).send(csv);
      } else {
        // Retornar JSON
        return res.status(200).json(itens);
      }
    } catch (error) {
      console.error('Erro ao exportar inventário:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao exportar inventário'
      });
    }
  },
  
  // Buscar categorias disponíveis
  async categorias(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      
      const itens = await prisma.inventario.findMany({
        where: {
          userId,
          categoria: {
            not: null
          }
        },
        select: {
          categoria: true
        },
        distinct: ['categoria']
      });
      
      const categorias = itens
        .map(item => item.categoria)
        .filter(categoria => categoria !== null) as string[];
      
      return res.status(200).json(categorias);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao buscar categorias do inventário'
      });
    }
  }
};

export default inventarioController; 