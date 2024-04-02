import { z } from "zod";

const createSpecialtiesValidationSchema = z.object({
  title: z.string({
    required_error: "Title required!",
  }),
});

export const specialtiesValidation = {
  createSpecialtiesValidationSchema,
};
