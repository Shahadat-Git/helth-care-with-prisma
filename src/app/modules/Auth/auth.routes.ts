import express from "express";
import { authContollers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", authContollers.loginUesr);
router.post("/refresh-token", authContollers.refreshToken);

router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN),
  authContollers.changePassword
);

router.post("/forgot-password", authContollers.forgotPassword);
router.post("/reset-password", authContollers.resetPassword);

export const authRoutes = router;
