import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const agentsRouters = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));
      // await new Promise((res) => setTimeout(res, 5000));

      // throw new TRPCError({code:"BAD_REQUEST",message:"lol  failed"})
      return data[0];
    }),
  getmany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);
    // await new Promise((res) => setTimeout(res, 5000));

    // throw new TRPCError({code:"BAD_REQUEST",message:"lol  failed"})
    return data;
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      // const { name, instructions } = input;
      const { auth } = ctx;

      const result = await db
        .insert(agents)
        .values({
          ...input,
          userId: auth?.user?.id,
        })
        .returning();

      return result[0];
    }),
});
