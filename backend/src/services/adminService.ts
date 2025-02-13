import { Prisma, PrismaClient } from "@prisma/client";
import { encryptPassword } from "../utils/userUtility";

const prisma = new PrismaClient();

export const createAdmin = async (adminData: Prisma.UserCreateInput) => {
  const encryptedPassword = await encryptPassword(adminData.password);

  const admin = await prisma.user.create({
    data: {
      ...adminData,
      password: encryptedPassword,
      role: {
        create: {
          roleName: "admin",
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      email: true,
    },
  });
  return admin;
};

export const findAdminForRegister = async (email: string) => {
  const admin = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });
  return admin;
};

export const findAdminForLogin = async (email: string) => {
  const admin = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      role: {
        select: {
          roleName: true,
        },
      },
      password: true,
    },
  });
  return admin;
};

export const isAdmin = async (id: number) => {
  const admin = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      role: {
        select: {
          roleName: true,
        },
      },
    },
  });
  return admin;
};
