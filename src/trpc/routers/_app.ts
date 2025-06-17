import { createTRPCRouter } from "../init";
import { agentsRouters } from "@/modules/agents/server/procedures";
export const appRouter = createTRPCRouter({
  agents: agentsRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;
