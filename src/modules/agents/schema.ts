import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instruction: z.string().min(1, { message: "Name is required" }),
});

export const agentsUpdataSchema = agentsInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
