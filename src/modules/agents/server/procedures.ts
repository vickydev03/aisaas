import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { agentsInsertSchema, agentsUpdataSchema } from "../schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { TRPCError } from "@trpc/server";

export const agentsRouters = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data = await db
        .select({
          meetingCount: db.$count(meetings, eq(agents.id, meetings.agentId)),
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        );
      // await new Promise((res) => setTimeout(res, 5000));

      // throw new TRPCError({cod e:"BAD_REQUEST",message:"lol  failed"})

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return data[0];
    }),
  getmany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await db
        .select({
          meetingCount: db.$count(meetings, eq(agents.id, meetings.agentId)),
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            input?.search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        )
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(agents)
        .where(
          and(
            eq(agents.userId, ctx.auth.user.id),
            input?.search ? ilike(agents.name, `%${input.search}%`) : undefined
          )
        );

      const totalPage = Math.ceil(total.count / input.pageSize);
      // await new Promise((res) => setTimeout(res, 5000));

      // throw new TRPCError({code:"BAD_REQUEST",message:"lol  failed"})
      return {
        items: data,
        total: total.count,
        totalPage,
      };
    }),

  create: premiumProcedure("agents")
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

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await db
        .delete(agents)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        );

      if (result.rowCount === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return result;
    }),

  update: protectedProcedure
    .input(agentsUpdataSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .update(agents)
        .set(input)
        .where(
          and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
        )
        .returning();

      console.log(data, "updating");

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      return data;
    }),
});
