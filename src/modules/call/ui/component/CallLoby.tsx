import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { generateAvartar } from "@/lib/avatar";
// import {
//   VideoPreview,
//   useCallStateHooks,
//   DefaultVideoPlaceholder,
//   StreamVideoParticipant,
//   ToggleAudioPreviewButton,
//   ToggleVideoPreviewButton,
// } from "@stream-io/video-react-sdk";
// import { SetStateAction, Dispatch, useRef } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import {
  LogInIcon,
  // MicIcon,
  // MicOff,
  // VideoIcon,
  // VideoOffIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
// import CustomeVideoPreview from "./CustomeVideoPreview";

interface Props {
  onJoin: () => void;
  // isVideoOn: boolean;
  // isMicOn: boolean;
  // setVideoOn: Dispatch<SetStateAction<boolean>>;
  // setMicOn: Dispatch<SetStateAction<boolean>>;
}
function CallLoby({ onJoin }: Props) {
  // const { useCameraState, useMicrophoneState } = useCallStateHooks();

  // const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  // const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();

  // const videoRef = useRef<HTMLDivElement>(null);

  // const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;
  // const allowBrowserPermission = () => {
  //   return (
  //     <div className=" text-sm ">
  //       {" "}
  //       Please grant your browser a permission to access your camera and
  //       microphone.
  //     </div>
  //   );
  // };
  // const disableVideoPreview = () => {
  //   const { data } = authClient.useSession();

  //   return (
  //     <>
  //       <DefaultVideoPlaceholder
  //         participant={
  //           {
  //             name: data?.user.name ?? "",
  //             image:
  //               data?.user.image ??
  //               generateAvartar({
  //                 seed: data?.user.name ?? "",
  //                 variant: "initials",
  //               }),
  //           } as StreamVideoParticipant
  //         }
  //       />
  //     </>
  //   );
  // };

  
  return (
    <div className="flex   items-center justify-center min-h-[200px]  w-screen h-screen   bg-radial  from-sidebar-accent to-sidebar ">
      <div className="py-4 px-8  flex items-center flex-1  justify-center ">
        <div className=" flex flex-col  items-center justify-center gap-y-6 bg-background  rounded-lg p-10  shadow-sm w-[300px] sm:w-[350px] md:w-[400px] ">
          <div className="flex  flex-col  gap-y-2 text-center ">
            <h6 className=" text-lg  font-medium ">Ready to join</h6>
            <p className="text-sm ">Join the  meeting  </p>
          </div>
          <div className="">
            {/* <VideoPreview
              mirror={false}
              className="video-preview w-[300px] overflow-hidden object-contain "
              DisabledVideoPreview={
                hasBrowserMediaPermission
                  ? disableVideoPreview
                  : allowBrowserPermission
              }
            /> */}
            {/* <CustomeVideoPreview isMicOn={isMicOn} isVideoOn={isVideoOn} /> */}
          </div>
          <div className=" flex gap-x-2">
            {/* <ToggleVideoPreviewButton /> */}
            {/* <Button
              onClick={() => setVideoOn((e) => !e)}
              className="p-4 rounded-4xl"
              variant={"outline"}
            >
              {isVideoOn ? (
                <VideoIcon className="stroke-red-500   " />
              ) : (
                <VideoOffIcon className="stroke-red-500" />
              )}
            </Button>
            <Button
              onClick={() => setMicOn((e) => !e)}
              variant={"outline"}
              className="p-4  rounded-4xl"
            >
              {isMicOn ? (
                <MicIcon className=" stroke-red-500" />
              ) : (
                <MicOff className=" stroke-red-500" />
              )}
            </Button> */}
            {/* <ToggleAudioPreviewButton /> */}
          </div>
          <div className="flex  gap-x-2  justify-between  w-full ">
            <Button asChild variant={"ghost"}>
              <Link href={"/meetings"}>Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
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
