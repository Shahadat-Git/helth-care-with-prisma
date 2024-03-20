import { Request, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFilds } from "./admin.constant";

const getAll = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFilds);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = await adminServices.getAllFromDB(filters, options);
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
