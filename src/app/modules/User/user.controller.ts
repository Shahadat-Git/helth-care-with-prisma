import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  const data = req?.body;
  try {
    const result = await userServices.createAdminIntoDB(data);
    res.status(200).json({
      status: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (error:any) {
    res.status(500).json({
      status: false,
      message: error.name,
      error: error,
    });
  }
};

export const userController = {
  createAdmin,
};
