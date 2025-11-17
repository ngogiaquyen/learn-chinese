// check-prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const models = Object.keys(prisma).filter(
  (key) => !key.startsWith('$') && !key.startsWith('_') && typeof (prisma as any)[key] === 'object'
);

console.log('Các model Prisma hiện có:', models.length > 0 ? models : 'KHÔNG CÓ MODEL NÀO (lỗi rồi đó!)');
console.log('Toàn bộ keys:', Object.keys(prisma));

prisma.$disconnect();