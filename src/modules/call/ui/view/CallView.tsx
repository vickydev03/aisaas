"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import ErrorState from "@/components/ErrorState";
import CallProvider from "../component/CallProvider";

interface Props {
  meetingId: string;
}

function CallView({ meetingId }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  if (data.status === "completed") {
    return (
      <div className="flex h-screen justify-center items-center ">
        <ErrorState
          title="Meeting has ended"
          description="You can no longer join the meeting"
        />
      </div>
    );
  }
  return (
    <div>
      <CallProvider meetingId={meetingId} meetingName={data.name} />
    </div>
  );
}

export default CallView;
