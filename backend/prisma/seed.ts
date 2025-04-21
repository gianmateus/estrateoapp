import { PrismaClient } from '../src/generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email: 'gian@example.com' }
  });

  if (!existingUser) {
    // Criar o usuário administrador
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.create({
      data: {
        nome: 'Gian Mateus',
        email: 'gian@example.com',
        password: hashedPassword,
        permissoes: 'admin',
        tipoNegocio: 'restaurante',
        cargo: 'Administrador',
      }
    });
    
    console.log(`Usuário administrador criado: ${user.email}`);
  } else {
    console.log('Usuário administrador já existe, pulando criação.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 