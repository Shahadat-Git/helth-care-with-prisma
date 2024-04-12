import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { paymentServices } from "./payment.service";

const paymentInit = catchAsync(async (req: Request, res: Response) => {
    const {appointmentId}= req.params
    const result = await paymentServices.paymentInit(appointmentId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initialization successfully",
        data: result
    })
})

const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.validatePayment(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment validation successfully",
        data: result
    })
})

export const paymentControllers = {
    paymentInit,
    validatePayment
}