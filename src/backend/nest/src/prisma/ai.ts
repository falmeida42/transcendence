// ai.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAI() {
  const userData = {
    login: 'AI',
    username: 'Artificial Intelligence',
    image: 'https://sollartes.files.wordpress.com/2014/09/marvin_cor.png',
  };

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      login: 'AI',
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: userData,
    });
  }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
