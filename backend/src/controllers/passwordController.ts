/**
 * Controlador de recuperação de senha
 * 
 * Implementa o fluxo de recuperação de senha via email:
 * 1. Usuário solicita recuperação informando seu email
 * 2. Sistema gera um token único e envia um email com um link para redefinição
 * 3. Usuário clica no link e redefine a senha
 * 4. Sistema verifica o token e atualiza a senha
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { jwtConfig, serverConfig } from '../config';
import { sendPasswordResetEmail } from '../services/emailService';

/**
 * Controller para gerenciar o fluxo de recuperação de senha
 */
class PasswordController {
  /**
   * Gera token e envia email para recuperação de senha
   */
  async requestPasswordReset(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Validação básica
      if (!email) {
        return res.status(400).json({
          error: true,
          message: 'E-mail é obrigatório'
        });
      }

      // Resposta neutra (independentemente de encontrar o usuário ou não)
      // Isso evita enumeração de usuários
      const responseMessage = {
        success: true,
        message: 'Se o e-mail estiver cadastrado, enviaremos instruções para recuperação de senha.'
      };

      // Buscar usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email }
      });

      // Se o usuário não existir, retornamos a mesma mensagem neutra
      // Isso evita que alguém saiba quais emails estão cadastrados
      if (!user) {
        // Aguardar um tempo aleatório para evitar timing attacks
        // que poderiam revelar se o email existe ou não baseado no tempo de resposta
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        return res.status(200).json(responseMessage);
      }

      // Verificar se o token JWT está configurado
      if (!jwtConfig.resetSecret) {
        console.error('RESET_TOKEN_SECRET não definido no ambiente');
        return res.status(500).json({
          error: true,
          message: 'Erro de configuração do servidor'
        });
      }

      // Gerar um token aleatório usando UUID
      const resetToken = uuidv4();

      // Gerar token JWT para redefinição de senha
      const token = jwt.sign(
        { id: user.id, resetToken },
        jwtConfig.resetSecret as string,
        { expiresIn: jwtConfig.resetExpiresIn } as SignOptions
      );

      // Salvar token e data de expiração no banco
      // e definir a data de expiração para 1 hora no futuro
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpires: new Date(Date.now() + 3600000) // 1 hora
        }
      });

      // Enviar email com token JWT
      const emailSent = await sendPasswordResetEmail(
        user.email,
        token,
        serverConfig.clientUrl
      );

      if (!emailSent) {
        console.error('Falha ao enviar email de recuperação');
        return res.status(500).json({
          error: true,
          message: 'Falha ao enviar email de recuperação'
        });
      }

      // Resposta neutra (independentemente de encontrar o usuário ou não)
      return res.status(200).json(responseMessage);
    } catch (error) {
      console.error('Erro ao processar solicitação de recuperação de senha:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Redefine a senha usando o token recebido
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      // Validação básica
      if (!token || !password) {
        return res.status(400).json({
          error: true,
          message: 'Token e senha são obrigatórios'
        });
      }

      // Validar complexidade da senha
      if (password.length < 6) {
        return res.status(400).json({
          error: true,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }

      // Verificar se o token JWT está configurado
      if (!jwtConfig.resetSecret) {
        console.error('RESET_TOKEN_SECRET não definido no ambiente');
        return res.status(500).json({
          error: true,
          message: 'Erro de configuração do servidor'
        });
      }

      let decoded;
      try {
        // Verificar e decodificar o token JWT
        decoded = jwt.verify(token, jwtConfig.resetSecret as string) as jwt.JwtPayload;
      } catch (jwtError) {
        return res.status(400).json({
          error: true,
          message: 'Token inválido ou expirado. Solicite um novo link de recuperação.'
        });
      }

      // Buscar o usuário pelo ID contido no token
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        // Incluir campos para consulta
        select: {
          id: true,
          email: true,
          password: true,
          passwordResetToken: true,
          passwordResetExpires: true
        }
      });

      if (!user) {
        return res.status(400).json({
          error: true,
          message: 'Token inválido ou expirado. Solicite um novo link de recuperação.'
        });
      }

      // Verificar se o usuário tem um token de reset válido
      if (!user.passwordResetToken || 
          user.passwordResetToken !== decoded.resetToken ||
          !user.passwordResetExpires || 
          user.passwordResetExpires < new Date()) {
        return res.status(400).json({
          error: true,
          message: 'Token inválido ou expirado. Solicite um novo link de recuperação.'
        });
      }

      // Hash da nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Atualizar senha e limpar os campos de reset
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null
        }
      });

      // Resposta de sucesso
      return res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return res.status(500).json({
        error: true,
        message: 'Erro interno do servidor'
      });
    }
  }
}

export default new PasswordController(); 