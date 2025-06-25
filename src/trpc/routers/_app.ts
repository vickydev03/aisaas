import { MeetingsRouters } from "@/modules/meetings/server/procedures";
import { createTRPCRouter } from "../init";
import { agentsRouters } from "@/modules/agents/server/procedures";
import { premiumRouters } from "@/modules/premium/server/procedure";
export const appRouter = createTRPCRouter({
  agents: agentsRouters,
  meetings:MeetingsRouters,
  premium:premiumRouters
});
// export type definition of API
export type AppRouter = typeof appRouter;
