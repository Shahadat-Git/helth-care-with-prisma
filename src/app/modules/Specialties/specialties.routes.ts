import exprss, { NextFunction, Request, Response } from "express";
import { specialtiesControllers } from "./specialties.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { specialtiesValidation } from "./specialties.validations";

const router = exprss.Router();

router.get(
  "/",
 specialtiesControllers.getFromDB
);

router.post(
  "/",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = specialtiesValidation.createSpecialtiesValidationSchema.parse(JSON.parse(req.body.data));
    return specialtiesControllers.insertIntoDB(req, res, next);
  }
);

router.delete(
  "/delete/:id",
 specialtiesControllers.deleteFromDB
);

export const specialtiesRoutes = router;
