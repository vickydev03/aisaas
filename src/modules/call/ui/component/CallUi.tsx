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
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const handleJoin = async () => {
    if (!call) return;

    // Respect state
    if (isCameraOn) {
      await call.camera.enable();
    } else {
      await call.camera.disable();
    }

    if (isMicrophoneOn) {
      await call.microphone.enable();
    } else {
      await call.microphone.disable();
    }

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
      {show == "lobby" && (
        <CallLoby
          onJoin={handleJoin}
          isMicOn={isMicrophoneOn}
          isVideoOn={isCameraOn}
          setMicOn={setIsMicrophoneOn}
          setVideoOn={setIsCameraOn}
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
