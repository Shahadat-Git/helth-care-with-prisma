import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploader";
import { userSearchAbleFields } from "./user.constants";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { TPaginationOptions } from "../../interfaces/paginations";

const createAdminIntoDB = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary: any = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const data = req?.body;

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

const createDoctorIntoDB = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary: any = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const data = req?.body;

  const hashedPassword = await bcrypt.hash(data?.password, 12);
  const userData = {
    email: data.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const doctorData = data.doctor;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    console.log(doctorData);
    const createDoctorData = await transactionClient.doctor.create({
      data: doctorData,
    });

    return createDoctorData;
  });
  return result;
};

const createPatientIntoDB = async (req: any) => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary: any = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const data = req?.body;

  const hashedPassword = await bcrypt.hash(data?.password, 12);
  const userData = {
    email: data.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const patientData = data.patient;

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createPatientData = await transactionClient.patient.create({
      data: patientData,
    });

    return createPatientData;
  });
  return result;
};

const getAllFromDB = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
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

const changeProfileStatus = async (
  id: string,
  status: {
    body: UserRole;
  }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });


  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status?.body,
  });

  return updateUserStatus;
};

export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllFromDB,
  changeProfileStatus,
};
