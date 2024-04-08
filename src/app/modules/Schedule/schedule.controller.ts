import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ScheduleService } from "./schedule.service";
import pick from "../../../shared/pick";
import { TAuthUser } from "../../interfaces/common";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.inserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request &{user?:TAuthUser}, res: Response) => {

    const filters = pick(req.query, ["startDateTime","endDateTime"]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req?.user
    const result = await ScheduleService.getAllFromDB(filters, options,user as TAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedules fetched successfully!",
        data: result
    });
});


export const ScheduleController = {
    inserIntoDB,
    getAllFromDB
};