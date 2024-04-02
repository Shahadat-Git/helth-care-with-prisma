import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.constants";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { TAuthUser } from "../../interfaces/common";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.createAdminIntoDB(req);
    res.status(200).json({
      status: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.name,
      error: error,
    });
  }
};

const createDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.createDoctorIntoDB(req);
    res.status(200).json({
      status: true,
      message: "Doctor created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.name,
      error: error,
    });
  }
};
const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.createPatientIntoDB(req);
    res.status(200).json({
      status: true,
      message: "Patient created successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.name,
      error: error,
    });
  }
};

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.query)
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userServices.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users data fetched!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user;
    const result = await userServices.getMyProfileFromDB(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users profile data fetched",
      data: result,
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req?.user;
    const result = await userServices.updateMyProfile(user, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users profile updated",
      data: result,
    });
  }
);

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
