import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

// Interface para os dados do usuário
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  permissoes?: string[];
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
      const { name, email, password, permissoes, tipoNegocio, cargo } = req.body;

      // Validação básica
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já cadastrado com este email' });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar novo usuário usando o Prisma
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          permissoes: permissoes || [],
          tipoNegocio,
          cargo
        }
      });

      // Resposta de sucesso (sem incluir a senha)
      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({ 
        message: 'Usuário registrado com sucesso',
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Login de usuário
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validação básica
      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      // Buscar usuário pelo email usando o Prisma
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        "chave_secreta_jwt_estrateo",
        { expiresIn: "1d" }
      );

      return res.json({ 
        message: 'Login realizado com sucesso',
        token,
        user: {
          id: user.id,
          nome: user.name,
          email: user.email,
          permissoes: user.permissoes || [],
          tipoNegocio: user.tipoNegocio,
          cargo: user.cargo
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  // Método para obter informações do usuário atual (para testes)
  async me(req: Request, res: Response) {
    try {
      const { id } = req.user;
      
      // Buscar usuário pelo ID usando o Prisma
      const user = await prisma.user.findUnique({
        where: { id }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Retornar dados do usuário sem a senha
      const { password: _, ...userWithoutPassword } = user;
      return res.json({ 
        user: {
          ...userWithoutPassword,
          nome: user.name,
          permissoes: user.permissoes || []
        }
      });
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
      return res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new AuthController(); 