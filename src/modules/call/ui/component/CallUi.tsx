import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import CallLoby from "./CallLoby";
import CallActive from "./CallActive";
import CallEnded from "./CallEnded";

interface Props {
  meetingName: string;
}
function CallUi({ meetingName }: Props) {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const handleJoin = async () => {
    if (!call) return;

     await call.join();
    setShow("call");
  };
  const handleLeave = async () => {
    if (!call) return;

    await call.endCall();
    setShow("ended");
  };
  return (
    <StreamTheme className=" h-screen">
      {show == "lobby" && <CallLoby onJoin={handleJoin} />}
      {show == "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
      {show == "ended" && <CallEnded/>}
    </StreamTheme>
  );
}

export default CallUi;
