import { z } from "zod";

const updateSchema = z.object({
  name: z.string(),
  contactNumber: z.string(),
});

export const adminValidations = {
  updateSchema,
};
