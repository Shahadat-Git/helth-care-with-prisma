import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
    const data = req?.body
  const result = await userServices.createAdminIntoDB(data);
  res.send(result);
};

export const userController = {
  createAdmin,
};
