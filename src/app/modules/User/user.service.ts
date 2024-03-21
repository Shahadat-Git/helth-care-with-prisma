import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdminIntoDB = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data?.password, 12);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const adminData = data.admin;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createAdminData = await transactionClient.admin.create({
      data: adminData,
    });

    return createAdminData;
  });
  return result;
};

export const userServices = {
  createAdminIntoDB,
};
