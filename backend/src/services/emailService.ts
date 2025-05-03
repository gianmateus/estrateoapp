/**
 * Serviço de Email
 * 
 * Este módulo gerencia o envio de emails usando o nodemailer
 * Configurado para utilizar as credenciais SMTP do arquivo .env
 */

import nodemailer from 'nodemailer';
import { emailConfig } from '../config';

/**
 * Transportador de email
 * Cria um transportador SMTP configurado com as credenciais do .env
 */
const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password
  }
});

/**
 * Interface para as opções do email
 */
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Envia um email usando o transportador SMTP configurado
 * 
 * @param options - Opções do email (destinatário, assunto, corpo)
 * @returns Promise com o resultado do envio
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!emailConfig.host || !emailConfig.user || !emailConfig.password) {
      console.error('Configurações de email incompletas. Verifique as variáveis de ambiente.');
      return false;
    }

    const mailOptions = {
      from: `Estrateo <${emailConfig.from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}

/**
 * Envia um email de recuperação de senha
 * 
 * @param to Email do destinatário
 * @param token Token de recuperação de senha
 * @param frontendUrl URL base do frontend para construir o link completo
 * @returns Promise com o resultado do envio
 */
export async function sendPasswordResetEmail(
  to: string,
  token: string,
  frontendUrl: string
): Promise<boolean> {
  const resetLink = `${frontendUrl}/reset-password?token=${token}`;
  
  const subject = '🔐 Recuperação de Senha — Estrateo';
  
  const text = `
Olá, recebemos um pedido para redefinir sua senha no Estrateo.

Clique no link abaixo para criar uma nova senha (válido por 1 hora):

${resetLink}

Se você não solicitou essa ação, apenas ignore este e-mail.
  `;
  
  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4a5568;">Recuperação de Senha - Estrateo</h2>
  <p>Olá, recebemos um pedido para redefinir sua senha no Estrateo.</p>
  <p>Clique no botão abaixo para criar uma nova senha (válido por 1 hora):</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" 
       style="background-color: #3182ce; color: white; padding: 12px 24px; 
              text-decoration: none; border-radius: 4px; font-weight: bold;">
      Redefinir minha senha
    </a>
  </p>
  <p>Ou copie e cole o link abaixo no seu navegador:</p>
  <p style="background-color: #f7fafc; padding: 12px; border-radius: 4px; word-break: break-all;">
    ${resetLink}
  </p>
  <p style="color: #718096; margin-top: 30px; font-size: 14px;">
    Se você não solicitou essa ação, apenas ignore este e-mail.
  </p>
</div>
  `;
  
  return sendEmail({
    to,
    subject,
    text,
    html
  });
} 