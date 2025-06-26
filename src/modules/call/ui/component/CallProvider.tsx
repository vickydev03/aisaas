"use client";
import { authClient } from "@/lib/auth-client";
import { generateAvartar } from "@/lib/avatar";
import {  Loader2Icon } from "lucide-react";
import React from "react";
import CallConnect from "./CallConnect";




interface Props {
  meetingId: string;
  meetingName: string;
}
function CallProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex  h-screen justify-center items-center  bg-radial  from-sidebar-accent">
        {" "}
        <Loader2Icon className="size-6 animate-spin text-white " />
      </div>
    );
  }
  return (
    // <div className="">
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={data.user.id}
        userName={data.user.name}
        userImage={data.user.image ?? generateAvartar({seed:data.user.name,variant:"initials"})}
      />
    // </div>
  );
}

export default CallProvider;
