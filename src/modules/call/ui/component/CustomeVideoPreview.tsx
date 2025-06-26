// import GenerateAvartar from "@/components/GenerateAvatar";
// import { authClient } from "@/lib/auth-client";
// // import { useCallStateHooks } from "@stream-io/video-react-sdk";
// import React, { useEffect, useRef, useState } from "react";
// interface Props {
//   isVideoOn: boolean;
//   isMicOn: boolean;
// }

// function CustomeVideoPreview({ isMicOn, isVideoOn }: Props) {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // const { useCameraState, useMicrophoneState } = useCallStateHooks();
//   console.log(error);
//   // const { hasBrowserPermission: hasCameraPermission } = useCameraState();
//   // const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();

//   useEffect(() => {
//     let stream: MediaStream;

//     const startCamera = async () => {
//       try {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: isVideoOn,
//           audio: isMicOn,
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Unknown error accessing camera";
//         console.error("Camera error:", err);
//         setError(errorMessage);
//       }
//     };

//     startCamera();

//     // Cleanup on unmount
//     return () => {
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//       stream?.getTracks().forEach((track) => track.stop());
      
//     };
//   }, [isVideoOn,isMicOn]);

//   const { data } = authClient.useSession();

//   return (
//     <div className="w-[300px] h-[200px]">
//       {!isVideoOn ? (
//         <div className="bg-slate-700 w-full h-full flex items-center justify-center p-10">
//           <GenerateAvartar
//             className="size-10"
//             seed={data?.user.name}
//             variant="initials"
//           />
//         </div>
//       ) : (
//         <video
//           className=" object-contain w-full h-full border-none"
//           autoPlay
//           ref={videoRef}
//         />
//       )}
//     </div>
//   );
// }

// export default CustomeVideoPreview;

import React from 'react'

function CustomeVideoPreview() {
  return (
    <div>CustomeVideoPreview</div>
  )
}

export default CustomeVideoPreview