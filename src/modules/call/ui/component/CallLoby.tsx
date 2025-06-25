import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvartar } from "@/lib/avatar";
import {
  VideoPreview,
  useCallStateHooks,
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

import { LogInIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface Props {
  onJoin: () => void;
}
function CallLoby({ onJoin }: Props) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;
  const allowBrowserPermission = () => {
    return (
      <div className=" text-sm ">
        {" "}
        Please grant your browser a permission to access your camera and
        microphone.
      </div>
    );
  };
  const disableVideoPreview = () => {
    const { data } = authClient.useSession();

    return (
      <>
        <DefaultVideoPlaceholder
          participant={
            {
              name: data?.user.name ?? "",
              image:
                data?.user.image ??
                generateAvartar({
                  seed: data?.user.name ?? "",
                  variant: "initials",
                }),
            } as StreamVideoParticipant
          }
        />
      </>
    );
  };
  return (
    <div className="flex flex-col  items-center justify-center  h-full  bg-radial  from-sidebar-accent to-sidebar ">
      <div className="py-4 px-8  flex items-center flex-1  justify-center ">
        <div className=" flex flex-col  items-center justify-center gap-y-6 bg-background  rounded-lg p-10  shadow-sm ">
          <div className="flex  flex-col  gap-y-2 text-center ">
            <h6 className=" text-lg  font-medium ">Ready to join</h6>
            <p className="text-sm ">Set up your call before joining </p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission
                ? disableVideoPreview
                : allowBrowserPermission
            }
          />
          <div className=" flex gap-x-2">
            <ToggleVideoPreviewButton />
            <ToggleAudioPreviewButton />
          </div>
          <div className="flex  gap-x-2  justify-between  w-full ">
            <Button asChild variant={"ghost"}>
              <Link href={"/meetings"}>Cancel</Link>
            </Button>
            <Button  onClick={onJoin}>
              <LogInIcon />
              Join meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallLoby;
