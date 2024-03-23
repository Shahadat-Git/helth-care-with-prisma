import express from "express";
import { authContollers } from "./auth.controller";

const router = express.Router();

router.post("/login", authContollers.loginUesr);
router.post("/refresh-token", authContollers.refreshToken);

export const authRoutes = router;
