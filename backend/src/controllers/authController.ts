import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

// Interface para os dados do usuário
interface User {
  id: string;
  nome: string;
  email: string;
  password: string;
  permissoes: string;
  tipoNegocio?: string;
  cargo?: string;
}

// Array temporário para armazenar usuários (em um projeto real, isto seria um banco de dados)
const users: User[] = [];
let nextId = 1;

export class AuthController {
  // Registro de novo usuário
  async register(req: Request, res: Response) {
    try {
      const { nome, email, password, permissoes, tipoNegocio, cargo } = req.body;

      // Validação básica
      if (!nome || !email || !password) {
        return res.status(400).json({ 
          error: true,
          message: 'Todos os campos são obrigatórios' 
        });
      }

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: true,
          message: 'Usuário já cadastrado com este email' 
        });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar novo usuário usando o Prisma
      const newUser = await prisma.user.create({
        data: {
          nome,
          email,
          password: hashedPassword,
          permissoes: permissoes || 'user',
          tipoNegocio,
          cargo
        }
      });

      // Resposta de sucesso (sem incluir a senha)
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({ 
        success: true,
        message: 'Usuário registrado com sucesso',
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ 
        error: true,
        message: 'Erro interno do servidor' 
      });
    }
  }

  // Login de usuário
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ 
          error: true,
          message: 'Email e senha são obrigatórios' 
        });
      }

      // Buscar usuário pelo email usando o Prisma
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ 
          error: true,
          message: 'Credenciais inválidas' 
        });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: true,
          message: 'Credenciais inválidas' 
        });
      }

      // Verificar se JWT_SECRET está definido
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET não definido no ambiente');
        return res.status(500).json({ 
          error: true,
          message: 'Erro de configuração do servidor' 
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, nome: user.nome },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } as SignOptions
      );

      // Gerar refresh token
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET || jwtSecret;
      const refreshToken = jwt.sign(
        { id: user.id },
        refreshSecret,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d" } as SignOptions
      );

      return res.json({ 
        success: true,
        message: 'Login realizado com sucesso',
        token,
        refreshToken,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          permissoes: user.permissoes,
          tipoNegocio: user.tipoNegocio,
          cargo: user.cargo
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ 
        error: true,
        message: 'Erro interno do servidor' 
      });
    }
  }

  // Método para obter informações do usuário atual
  async me(req: Request, res: Response) {
    try {
      const { id } = req.user;
      
      // Buscar usuário pelo ID usando o Prisma
      const user = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!user) {
        return res.status(404).json({ 
          error: true,
          message: 'Usuário não encontrado' 
        });
      }
      
      // Retornar dados do usuário sem a senha
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ 
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      return res.status(500).json({ 
        error: true,
        message: 'Erro interno do servidor' 
      });
    }
  }

  // Método para atualizar o token com o refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          error: true,
          message: 'Refresh token é obrigatório'
        });
      }
      
      // Verificar se os segredos estão definidos
      const jwtSecret = process.env.JWT_SECRET;
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET || jwtSecret;
      
      if (!jwtSecret || !refreshSecret) {
        console.error('JWT_SECRET ou REFRESH_TOKEN_SECRET não definidos');
        return res.status(500).json({
          error: true,
          message: 'Erro de configuração do servidor'
        });
      }
      
      // Verificar o refresh token
      const decoded = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;
      
      // Buscar o usuário
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'Usuário não encontrado'
        });
      }
      
      // Gerar novo token
      const newToken = jwt.sign(
        { id: user.id, email: user.email, nome: user.nome },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" } as SignOptions
      );
      
      return res.json({
        success: true,
        token: newToken
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          error: true,
          message: 'Refresh token inválido ou expirado'
        });
      }
      
      console.error('Erro ao atualizar token:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro interno do servidor'
      });
    }
  }
}

export default new AuthController(); 