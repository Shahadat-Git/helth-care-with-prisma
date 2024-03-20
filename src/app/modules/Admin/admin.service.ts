import { Prisma, PrismaClient } from "@prisma/client";

const pirsma = new PrismaClient();

const getAllFromDB = async (query: any) => {
  const { searchTerm, ...filterData } = query;
  const andCondition: Prisma.AdminWhereInput[] = [];

  /* 
    [
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
    ]
*/
  const adminSearchAbleFields = ["name", "email"];

  if (query.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => {
        return {
          [field]: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }
  //   console.dir(andCondition, { depth: Infinity });

  if (Object.keys(filterData).length > 0) {
    // Object.keys(filterData).map(key=>())
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
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
