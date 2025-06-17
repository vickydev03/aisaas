import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const agentsRouters = createTRPCRouter({
  getmany: baseProcedure.query(async () => {
    const data = await db.select().from(agents);
    await new Promise((res) => setTimeout(res, 5000));

    // throw new TRPCError({code:"BAD_REQUEST",message:"lol  failed"})
    return data;
  }),
});
