import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

const validateRequest = (zodSchema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
