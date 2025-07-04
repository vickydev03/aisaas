import { StreamClient } from "@stream-io/node-sdk";

// or
// const { StreamClient } = require("@stream-io/node-sdk");
// import { StreamVideoClient } from "@stream-io/video-client";

const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!;
const secret = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_SECRET!;
export const streamVideo = new StreamClient(apiKey, secret);
// export const streamVideoClient = new StreamVideoClient();
