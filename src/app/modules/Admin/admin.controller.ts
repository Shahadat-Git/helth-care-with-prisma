import { NextFunction, Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFilds } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = pick(req.query, adminFilterableFilds);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await adminServices.getAllFromDB(filters, options);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All admin data fetched!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    next(error);
  }
};

const getSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req?.params?.id;
    const result = await adminServices.getSingleFromDb(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Single admin data fatched ",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req?.params?.id;
    const data = req?.body;
    const result = await adminServices.updateIntoDB(id, data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data updated ",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const deleteSingle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req?.params?.id;
    const result = await adminServices.deleteIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted ",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const softDelete = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req?.params?.id;
    const result = await adminServices.softDeleteIntoDB(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin data deleted ",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const adminControllers = {
  getAll,
  getSingle,
  updateSingle,
  deleteSingle,
  softDelete,
};
