import { z } from "zod";

export const MeetingInsertSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "agent is required" }),
});

export const meetingsUpdataSchema = MeetingInsertSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
