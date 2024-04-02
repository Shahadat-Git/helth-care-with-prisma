import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { specialtiesServices } from "./specialties.services";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.insertIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Doctor Specialties Created",
    data: result,
  });
});

const getFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.getFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Specialties  fetched!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtiesServices.deleteFromDB(req?.params?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Specialties  deleted!",
    data: result,
  });
});

export const specialtiesControllers = {
  insertIntoDB,
  getFromDB,
  deleteFromDB
};
