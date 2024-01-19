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

  const dummyData = {
    login: 'dummyUser',
    email: 'asda@tes.com',
    image: 'https://www.akc.org/wp-content/uploads/2017/11/Beagle-Puppy.jpg',
    first_name: 'Mike',
    last_name: 'TheBeagle',
    username: 'MikeTheBeagle',
  };

  const dummyData2 = {
    login: 'dummyUser2',
    email: 'asda@tes.com',
    image:
      'https://cdn.intra.42.fr/users/6e834c7689fb6ec761861181e5fc177c/maxthecorgi.png',
    first_name: 'Max',
    last_name: 'TheCorgi',
    username: 'MaxTheCorgi',
  };

  const existingUser2 = await prisma.user.findUnique({
    where: {
      login: 'dummyUser',
    },
  });

  const existingUser3 = await prisma.user.findUnique({
    where: {
      login: 'dummyUser2',
    },
  });

  if (!existingUser2) {
    await prisma.user.create({
      data: dummyData,
    });
  }

  if (!existingUser3) {
    await prisma.user.create({
      data: dummyData2,
    });
  }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
