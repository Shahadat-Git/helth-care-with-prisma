import express from "express";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/", adminControllers.getAll);
router.get("/:id", adminControllers.getSingle);
router.patch("/:id", adminControllers.updateSingle);
router.delete("/:id", adminControllers.deleteSingle);
router.delete("/soft/:id", adminControllers.softDelete);

export const adminRoutes = router;
