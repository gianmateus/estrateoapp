import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const userController = {
  // Listar todos os usuários
  async listar(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });
      
      return res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar usuários' 
      });
    }
  },

  // Buscar usuário por ID
  async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({ 
          error: true, 
          message: 'Usuário não encontrado' 
        });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao buscar usuário' 
      });
    }
  },

  // Criar novo usuário
  async criar(req: Request, res: Response) {
    try {
      const { nome, email, password } = req.body;
      
      // Validações básicas
      if (!nome || !email || !password) {
        return res.status(400).json({
          error: true,
          message: 'Dados incompletos. Informe nome, email e senha'
        });
      }
      
      // Verificar se já existe usuário com este email
      const usuarioExistente = await prisma.user.findUnique({
        where: { email }
      });
      
      if (usuarioExistente) {
        return res.status(400).json({
          error: true,
          message: 'Email já cadastrado'
        });
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Criar usuário
      const user = await prisma.user.create({
        data: {
          nome,
          email,
          password: hashedPassword
        },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });
      
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao criar usuário' 
      });
    }
  },

  // Atualizar usuário
  async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, password } = req.body;
      
      // Verificar se usuário existe
      const usuarioExistente = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!usuarioExistente) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Preparar dados para atualização
      const dadosAtualizacao: any = {};
      
      if (nome) dadosAtualizacao.nome = nome;
      if (email) dadosAtualizacao.email = email;
      if (password) {
        dadosAtualizacao.password = await bcrypt.hash(password, 10);
      }
      
      // Atualizar usuário
      const userAtualizado = await prisma.user.update({
        where: { id },
        data: dadosAtualizacao,
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true
        }
      });
      
      return res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user: userAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao atualizar usuário' 
      });
    }
  },

  // Excluir usuário
  async excluir(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Verificar se usuário existe
      const usuarioExistente = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!usuarioExistente) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Excluir usuário
      await prisma.user.delete({
        where: { id }
      });
      
      return res.status(200).json({
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao excluir usuário' 
      });
    }
  },

  // Buscar perfil do usuário atual
  async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          telefone: true,
          setor: true,
          permissoes: true,
          tipoNegocio: true,
          numeroFuncionarios: true,
          createdAt: true
        }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Perfil não encontrado'
        });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao buscar perfil do usuário'
      });
    }
  },

  // Atualizar perfil do usuário atual
  async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { 
        nome, 
        email, 
        cargo, 
        telefone, 
        setor, 
        tipoNegocio, 
        numeroFuncionarios 
      } = req.body;
      
      // Verificar se o perfil existe
      const perfilExistente = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!perfilExistente) {
        return res.status(404).json({
          error: true,
          message: 'Perfil não encontrado'
        });
      }
      
      // Atualizar perfil
      const userAtualizado = await prisma.user.update({
        where: { id },
        data: {
          nome: nome || perfilExistente.nome,
          email: email || perfilExistente.email,
          cargo,
          telefone,
          setor,
          tipoNegocio,
          numeroFuncionarios
        },
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
          telefone: true,
          setor: true,
          tipoNegocio: true,
          numeroFuncionarios: true,
          createdAt: true
        }
      });
      
      return res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        user: userAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro ao atualizar perfil do usuário'
      });
    }
  },

  // Alterar senha do usuário atual
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      
      // Validações básicas
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: true,
          message: 'Dados incompletos. Informe a senha atual e a nova senha'
        });
      }
      
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          error: true,
          message: 'Senha atual incorreta'
        });
      }
      
      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Atualizar senha
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword
        }
      });
      
      return res.status(200).json({
        message: 'Senha alterada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao alterar senha do usuário:', error);
      return res.status(500).json({ 
        error: true, 
        message: 'Erro ao alterar senha do usuário' 
      });
    }
  }
};

export default userController; 