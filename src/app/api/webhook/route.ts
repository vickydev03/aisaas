// import {
//   CallEndedEvent,
//   CallTranscriptionReadyEvent,
//   CallSessionParticipantLeftEvent,
//   CallRecordingReadyEvent,
//   CallSessionStartedEvent,
// } from "@stream-io/node-sdk";
// import { GoogleGenAI } from "@google/genai";

// import { and, eq, not } from "drizzle-orm";
// import { db } from "@/db/index";
// import { agents, meetings } from "@/db/schema";
// import { streamVideo } from "@/lib/sream-video";
// import { NextRequest, NextResponse } from "next/server";

// function verifysignatureWithSdk(body: string, signature: string): boolean {
//   return streamVideo.verifyWebhook(body, signature);
// }

// export const Post = async (req: NextRequest) => {
//   const signature = req.headers.get("x-signature");
//   const apikey = req.headers.get("x-api-key");

//   if (!signature || !apikey) {
//     return NextResponse.json(
//       { error: "Missing signature or API Key " },
//       { status: 400 }
//     );
//   }
//   const body = await req.text();

//   if (!verifysignatureWithSdk(body, signature)) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//   }

//   let payload: unknown;

//   try {
//     payload = JSON.parse(body) as Record<string, unknown>;
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
//   }

//   const eventtype = (payload as Record<string, unknown>)?.type;

//   if (eventtype === "call.session_started") {
//     const event = payload as CallSessionStartedEvent;
//     const meetingId = event.call.custom?.meetingId;

//     if (!meetingId) {
//       return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
//     }

//     const [existingMeeting] = await db
//       .select()
//       .from(meetings)
//       .where(
//         and(
//           eq(meetings.id, meetingId),
//           not(eq(meetings.status, "completed")),
//           not(eq(meetings.status, "active")),
//           not(eq(meetings.status, "cancelled"))
//         )
//       );

//     if (!existingMeeting) {
//       return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
//     }

//     await db.update(meetings).set({ status: "active", startedAt: new Date() });

//     const [existingAgent] = await db
//       .select()
//       .from(agents)
//       .where(eq(agents.id, existingMeeting.agentId));

//     if (!existingAgent) {
//       return NextResponse.json({ error: "Agent not find" }, { status: 404 });
//     }

//     const call = streamVideo.video.call("default", meetingId);

//     const realtimeClient = await streamVideo.video.connectOpenAi({
//       call,
//       openAiApiKey: process.env.OPEN_API_KEY!,
//       agentUserId: existingAgent.id,
//     });

//     realtimeClient.updateSession({
//       instructions: existingAgent.instruction,
//     });
//   } else if (eventtype === "call.session_participant_left") {
//     const event = payload as CallSessionParticipantLeftEvent;
//     const meetingId = event.call_cid.split(":")[1];

//     if (!meetingId) {
//       return NextResponse.json({ error: "Missing meetingid" }, { status: 400 });
//     }
//     const call = streamVideo.video.call("default", meetingId);
//     await call.end();
//   } else if (eventtype === "call.session_ended") {
//     const event = payload as CallEndedEvent;
//     const meetingId = event.call.custom?.meetingId;

//     if (!meetingId) {
//       return NextResponse.json({ error: "Missing meetingid" }, { status: 400 });
//     }

//     await db
//       .update(meetings)
//       .set({ status: "processing", endedAt: new Date() })
//       .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
//   } else if (eventtype === "call.transcription_ready") {
//     const event = payload as CallTranscriptionReadyEvent;
//     const meetingId = event.call_cid.split(":")[1];

//     const [updatedMeeting] = await db
//       .update(meetings)
//       .set({ transscriptUrl: event.call_transcription.url })
//       .where(eq(meetings.id, meetingId))
//       .returning();

//     if (!updatedMeeting) {
//       return NextResponse.json({ error: "meeting not found" }, { status: 400 });
//     }

//     // todo summery
//   } else if (eventtype === "call.recording_ready") {
//     const event = payload as CallRecordingReadyEvent;
//     const meetingId = event.call_cid.split(":")[1];

//     await db
//       .update(meetings)
//       .set({ recordingUrl:event.call_recording })
//       .where(eq(meetings.id, meetingId))
//       .returning();
//   }
//   return NextResponse.json({ status: "ok" });
// };

// src/app/api/webhook/route.ts

import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { and, eq, not } from "drizzle-orm";
import { db } from "@/db/index";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/sream-video";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export const config = {
  runtime: "nodejs",
};
function verifysignatureWithSdk(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apikey = req.headers.get("x-api-key");

  if (!signature || !apikey) {
    return NextResponse.json(
      { error: "Missing signature or API Key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifysignatureWithSdk(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventtype = (payload as Record<string, unknown>)?.type;

  if (eventtype === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, meetingId));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // try {
    //   const call = streamVideo.video.call("default", meetingId);

      // const realtimeClient = await streamVideo.video.connectOpenAi({
      //   call,
      //   openAiApiKey: process.env.OPEN_API_KEY!,
      //   agentUserId: existingAgent.id,
      // });

      // realtimeClient.updateSession({
      //   instructions: existingAgent.instruction,
      // });
    // } catch (error) {
    //   // console.log(error,"error from openai");
    // }
  } else if (eventtype === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const call = streamVideo.video.call("default", meetingId);
    const callState = await call.get();
    console.log(callState.members, "member ");

    const participants = callState.members.length;
    if (participants > 0) {
      console.log("keep it going");
    } else {
      await call.end();
    }
  } else if (eventtype === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventtype === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const [updatedMeeting] = await db
      .update(meetings)
      .set({ transscriptUrl: event.call_transcription.url })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 400 });
    }

    // Optional: Add Gemini/AI summary generation here

    await inngest.send({
      name: "meeting/processing",
      data: {
        meetingId: meetingId,
        transcriptUrl: updatedMeeting.transscriptUrl,
      },
    });
  } else if (eventtype === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(eq(meetings.id, meetingId));
  }

  return NextResponse.json({ status: "ok" });
}
