/**
 * Admin User Seed Script
 * This script creates an admin user with full access to the system.
 * 
 * Script de Seed para Usuário Administrador
 * Este script cria um usuário administrador com acesso completo ao sistema.
 */

import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';
import { 
  ADMIN_PERMISSION, 
  FULL_PAYMENT_PERMISSIONS, 
  FULL_INVENTORY_PERMISSIONS, 
  VIEW_PROFILE_PERMISSION, 
  EDIT_PROFILE_PERMISSION,
  VIEW_DASHBOARD_PERMISSION 
} from '../src/constants/permissions';

// Create a new Prisma client instance
// Criar uma nova instância do cliente Prisma
const prisma = new PrismaClient();

/**
 * Main seed function that creates the admin user
 * Função principal de seed que cria o usuário administrador
 */
async function seedAdminUser() {
  console.log('Starting admin user seed...');
  console.log('Iniciando seed do usuário administrador...');

  try {
    // Check if admin user already exists
    // Verificar se o usuário administrador já existe
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@estrateo.com'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Skipping creation.');
      console.log('Usuário administrador já existe. Pulando criação.');
      return;
    }

    // Create all permissions array
    // Criar array com todas as permissões
    const allPermissions = [
      ADMIN_PERMISSION,
      ...FULL_PAYMENT_PERMISSIONS,
      ...FULL_INVENTORY_PERMISSIONS,
      VIEW_PROFILE_PERMISSION,
      EDIT_PROFILE_PERMISSION,
      VIEW_DASHBOARD_PERMISSION
    ];

    // Hash the password using bcrypt
    // Criptografar a senha usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create the admin user
    // Criar o usuário administrador
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@estrateo.com',
        password: hashedPassword,
        permissoes: allPermissions,
        cargo: 'Administrador',
        tipoNegocio: 'Restaurante',
        createdAt: new Date()
      }
    });

    console.log('Admin user created successfully:');
    console.log('Usuário administrador criado com sucesso:');
    console.log(`ID: ${adminUser.id}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Permissions: ${adminUser.permissoes.join(', ')}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    // Close the database connection
    // Fechar a conexão com o banco de dados
    await prisma.$disconnect();
  }
}

// Execute the seed function
// Executar a função de seed
seedAdminUser()
  .catch((error) => {
    console.error('Fatal error during seed execution:', error);
    console.error('Erro fatal durante a execução do seed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed execution complete');
    console.log('Execução do seed completa');
  }); 