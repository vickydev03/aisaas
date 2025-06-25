import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { generateAvartar } from "@/lib/avatar";
import {
  createTRPCRouter,
  protectedProcedure,
  premiumProcedure,
} from "@/trpc/init";

import { z } from "zod";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  sql,
} from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { TRPCError } from "@trpc/server";
import { MeetingInsertSchema, meetingsUpdataSchema } from "../schema";
import { MeetingStatus, StreamTranscriptItem } from "../types";
import { streamVideo } from "@/lib/sream-video";
import JSONL from "jsonl-parse-stringify";
export const MeetingsRouters = createTRPCRouter({
  getTranscript: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );

      if (!existingMeeting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "meeting not found",
        });
      }

      if (!existingMeeting.transscriptUrl) {
        return [];
      }
      const transcript = await fetch(existingMeeting.transscriptUrl)
        .then((e) => e.text())
        .then((e) => JSONL.parse<StreamTranscriptItem>(e))
        .catch(() => {
          return [];
        });

      const speakersId = [...new Set(transcript.map((e) => e.speaker_id))];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakersId))
        .then((users) =>
          users.map((e) => ({
            ...e,
            image: e.image
              ? e.image
              : generateAvartar({ seed: e?.name, variant: "initials" }),
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakersId))
        .then((agents) =>
          agents.map((e) => ({
            ...e,
            image: generateAvartar({ seed: e.name, variant: "botttsNeutral" }),
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      const transcriptWithHuman = transcript.map((e) => {
        const speaker = speakers.find((item) => item.id === e.speaker_id);

        if (!speaker) {
          return {
            ...e,
            user: {
              name: "unknown",
              image: generateAvartar({ seed: "unknown",variant:"initials" }),
            },
          };
        }

        return { ...e, user: { name: speaker.name,image:speaker.image } };
      });
      return transcriptWithHuman
    }),
  generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generateAvartar({ seed: ctx.auth.user.name, variant: "initials" }),
      },
    ]);

    const expirationTime = Math.floor(Date.now() / 1000) + 3600;
    const issueAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issueAt,
    });

    return token;
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data = await db
        .select({
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        );
      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meeting not found",
        });
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
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Cancelled,
            MeetingStatus.Processing,
            MeetingStatus.Completed,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(meetings),
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined,
            input.status ? eq(meetings.status, input.status) : undefined,
            input.agentId ? eq(meetings.agentId, input.agentId) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined,
            input.status ? eq(meetings.status, input.status) : undefined,
            input.agentId ? eq(meetings.agentId, input.agentId) : undefined
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

  create: premiumProcedure("meetings")
    .input(MeetingInsertSchema)
    .mutation(async ({ ctx, input }) => {
      // const { name, instructions } = input;
      const { auth } = ctx;

      const result = await db
        .insert(meetings)
        .values({
          ...input,
          userId: auth?.user?.id,
        })
        .returning();

      const call = streamVideo.video.call("default", result[0].id);

      call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          // members: [{ user_id: "john", role: "admin" }, { user_id: "jack" }],
          custom: {
            color: "blue",
            meetingId: result[0].id,
            meetingName: result[0].name,
          },
          settings_override: {
            transcription: {
              language: "en",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },

            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, result[0].agentId));

      if (!existingAgent) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgent.id,
          name: existingAgent.name,
          role: "user",
          image: generateAvartar({
            seed: existingAgent.name,
            variant: "botttsNeutral",
          }),
        },
      ]);
      return result[0];
    }),

  update: protectedProcedure
    .input(meetingsUpdataSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      console.log(data, "updating");

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "meetings not found",
        });
      }

      return data;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      console.log(data, "updating");

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "meetings not found",
        });
      }

      return data;
    }),
});
