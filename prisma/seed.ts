import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const main = async () => {
  console.log('Start seeding ...');
  await prisma.user.create({
    data: { username: 'admin', phone: '18888888888', nickname: '管理员', password: '84bea2653fe3fd44e06e47e8fa419ad6' },
  });
  console.log('Seeding finished.');
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
