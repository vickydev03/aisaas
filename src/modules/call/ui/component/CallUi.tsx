import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import CallLoby from "./CallLoby";
import CallActive from "./CallActive";
import CallEnded from "./CallEnded";
import { streamVideo } from "@/lib/sream-video";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  meetingName: string;
  meetingId: string;
}
function CallUi({ meetingName, meetingId }: Props) {
  const call = useCall();
  // const [isCameraOn, setIsCameraOn] = useState(true);
  // const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const handleJoin = async () => {
    if (!call) return;
    await call.join();

    setShow("call");
    if (!data?.agentId) return null;

    const meeting = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call: meeting,
      openAiApiKey: process.env.OPEN_API_KEY!,
      agentUserId: data?.agentId,
    });

    realtimeClient.updateSession({
      instructions: data?.agent.instruction,
    });
  };

  const handleLeave = async () => {
    if (!call) return;

    await call.endCall();
    setShow("ended");
  };
  return (
    <StreamTheme className=" h-screen">
      {show == "lobby" && (
        <CallLoby
          onJoin={handleJoin}
          // isMicOn={isMicrophoneOn}
          // isVideoOn={isCameraOn}
          // setMicOn={setIsMicrophoneOn}
          // setVideoOn={setIsCameraOn}
        />
      )}
      {show == "call" && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show == "ended" && <CallEnded />}
    </StreamTheme>
  );
}

export default CallUi;
