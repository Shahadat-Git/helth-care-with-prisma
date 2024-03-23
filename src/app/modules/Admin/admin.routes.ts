import express, { NextFunction, Request, Response } from "express";
import { adminControllers } from "./admin.controller";
import { ZodSchema, z } from "zod";
import { adminValidations } from "./admin. validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", adminControllers.getAll);
router.get("/:id", adminControllers.getSingle);
router.patch(
  "/:id",
  validateRequest(adminValidations.updateSchema),
  adminControllers.updateSingle
);
router.delete("/:id", adminControllers.deleteSingle);
router.delete("/soft/:id", adminControllers.softDelete);

export const adminRoutes = router;
