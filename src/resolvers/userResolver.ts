import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  COWORKER = "COWORKER",
  MODERATOR = "MODERATOR",
  DELIVERY = "DELIVERY",
  SELLER = "SELLER"
}

export const userResolver = {
  User: {
    role: (parent: { role: string }) => {
      // تبدیل رشته role به enum Role در Prisma
      switch (parent.role.toUpperCase()) {
        case 'USER':
          return Role.USER;
        case 'ADMIN':
          return Role.ADMIN;
        case 'SUPER_ADMIN':
          return Role.SUPER_ADMIN;
        case 'COWORKER':
          return Role.COWORKER;
        case 'MODERATOR':
          return Role.MODERATOR;
        case 'DELIVERY':
          return Role.DELIVERY;
        case 'SELLER':
          return Role.SELLER;
        default:
          return Role.USER; // مقدار پیش‌فرض
      }
    },
  },
};
