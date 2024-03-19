import { Prisma, PrismaClient } from "@prisma/client";
import { constants } from "buffer";

const pirsma = new PrismaClient();

const getAllFromDB = async (query: any) => {
  const andCondition: Prisma.AdminWhereInput[] = [];
  if (query.searchTerm) {
    andCondition.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await pirsma.admin.findMany({
    where: whereConditions,
  });

  return result;
};

export const adminServices = {
  getAllFromDB,
};
