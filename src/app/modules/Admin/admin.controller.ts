import { Request, Response } from "express";
import { adminServices } from "./admin.service";

const getAll = async (req: Request, res: Response) => {
  try {
    const result = await adminServices.getAllFromDB(req.query);
    res.status(200).json({
      status: true,
      message: "All admin data fatched ",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.name || "Something want wrong !",
      error: error,
    });
  }
};

export const adminControllers = {
  getAll,
};
