import { Admin, Prisma, User, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOptions } from "../../interfaces/paginations";

const getAllFromDB = async (
  params: TAdminFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(options);
  const andCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => {
        return {
          [field]: {
            contains: params.searchTerm,
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
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andCondition.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : { createdAt: "desc" },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFromDb = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id: id,
      isDeleted: false,
    },
    data,
  });

  return result;
};

const deleteIntoDB = async (id: string): Promise<User | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.$transaction(async (transationClient) => {
    const adminDeletedData = await transationClient.admin.delete({
      where: {
        id: id,
      },
    });
    const userDeletedData = await transationClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return userDeletedData;
  });
  return result;
};

const softDeleteIntoDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });
  const result = await prisma.$transaction(async (transationClient) => {
    const adminDeletedData = await transationClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await transationClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const adminServices = {
  getAllFromDB,
  getSingleFromDb,
  updateIntoDB,
  deleteIntoDB,
  softDeleteIntoDB,
};
