"use client";
import React, { useEffect, useState } from "react";

import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  Call,
  CallingState,
  // VideoPreview,
} from "@stream-io/video-react-sdk";

import { LoaderIcon } from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import CallUi from "./CallUi";

interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage: string;
}
function CallConnect({
  meetingId,
  meetingName,
  userId,
  userImage,
  userName,
}: Props) {
  const trpc = useTRPC();
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  const [client, setClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const _client = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
      user: {
        id: userId,
        name: userName,
        image: userImage,
      },
      tokenProvider: generateToken,
    });
    setClient(_client);

    return () => {
      _client.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userImage, userName, generateToken]);

  const [call, setCall] = useState<Call>();

  useEffect(() => {
    if (!client) return;

    const _call = client.call("default", meetingId);
    _call.camera.disable();
    _call.microphone.disable();

    setCall(_call);
    // _call.join();

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
        setCall(undefined);
      }
    };
  }, [client, meetingId]);

  if (!call || !client) {
    return (
      <div className="flex  h-screen justify-center items-center  bg-radial  from-sidebar-accent">
        {" "}
        <LoaderIcon className="size-6 animate-spin text-white " />
      </div>
    );
  }
  return (
    // <div className="responsive-video-container">

    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUi meetingName={meetingName} meetingId={meetingId}/>
      </StreamCall>
    </StreamVideo>
    // </div>
  );
}

export default CallConnect;
