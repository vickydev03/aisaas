import { StreamTranscriptItem } from "@/modules/meetings/types";
import { inngest } from "./client";
import JSONl from "jsonl-parse-stringify";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { createAgent
  // , openai
  , TextMessage } from "@inngest/agent-kit";
import { gemini } from "inngest";

const summarizer = createAgent({
  name: "summarizer",
  system:
    `You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z`.trim(),
  model: gemini({ model: "gemini-1.5-flash", apiKey: process.env.GEMINI_KEY }),
});
export const meetingProcessing = inngest.createFunction(
  { id: "meeting/processing" },
  { event: "meeting/processing" },
  async ({ event, step }) => {
    const res = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONl.parse<StreamTranscriptItem>(res);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakersId = [...new Set(transcript.map((e) => e.speaker_id))];
      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakersId))
        .then((users) => users.map((e) => ({ ...e })));
      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakersId))
        .then((agents) => agents.map((e) => ({ ...e })));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((e) => {
        const speaker = speakers.find((item) => item.id === e.speaker_id);

        if (!speaker) {
          return {
            ...e,
            user: {
              name: "unknown",
            },
          };
        }

        return { ...speaker, user: { name: speaker.name } };
      });
    });

    const { output } = await summarizer.run(
      "summarize the following transcript:" +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(
          eq(meetings.id,event.data.meetingId)
        );
    });
  }
);
