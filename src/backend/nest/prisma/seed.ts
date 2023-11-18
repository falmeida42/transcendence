// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create dummy Users
  const post1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      login: 'dummy',
      name: 'Test Dummy',
    },
  });

  console.log({ post1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
