import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const insertIntoDB = async (req: Request) => {
  const payload = req?.body;
  const file = req?.file;
  if (file) {
    const uploadedData = await fileUploader.uploadToCloudinary(file);
    payload.icon = uploadedData?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: payload,
  });

  return result;
};

const getFromDB = async () => {
  const result = await prisma.specialties.findMany({});

  return result;
};

const deleteFromDB = async (id: string) => {
  await prisma.specialties.findUniqueOrThrow({
    where: {
      id: id,
    },
  });
  const result = await prisma.specialties.delete({
    where: {
      id: id,
    },
  });

  return result;
};

export const specialtiesServices = {
  insertIntoDB,
  getFromDB,
  deleteFromDB,
};
