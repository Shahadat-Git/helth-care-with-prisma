import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { DoctorScheduleService } from "./doctorSchedule.service";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";

const insertIntoDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {

    const user = req.user;
    const result = await DoctorScheduleService.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Schedule created successfully!",
        data: result
    });
});

const getMySchedule = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await DoctorScheduleService.getMySchedule(filters, options, user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule fetched successfully!",
        data: result
    });
});

const deleteFromDB = catchAsync(async (req: Request & { user?: TAuthUser }, res: Response) => {

    const user = req.user;
    const { id } = req.params;
    const result = await DoctorScheduleService.deleteFromDB(user as TAuthUser, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Schedule deleted successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['searchTerm', 'isBooked', 'doctorId', 'startDate', 'endDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await DoctorScheduleService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedule,
    deleteFromDB,
    getAllFromDB
};