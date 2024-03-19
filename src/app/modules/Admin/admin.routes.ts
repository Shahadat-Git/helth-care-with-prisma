import express from "express";
import { adminControllers } from "./admin.controller";


const router = express.Router();

router.get("/", adminControllers.getAll);

export const adminRoutes = router;
