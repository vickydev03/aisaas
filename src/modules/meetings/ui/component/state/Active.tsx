import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { VideoIcon } from "lucide-react";

interface Props {
  meetingId: string;
  // onCancelMeeting: () => void;
  // isCancelling: boolean;
}
function Active({ meetingId }: Props) {
  return (
    <div className="bg-white rounded-lg px-4 py-5  flex flex-col  gap-y-8 items-center justify-center   ">
      <EmptyState
        image="/upcoming.svg"
        title="Meeting is active"
        description="Meeting will end once all participants left"
      />
      <div className="flex flex-col-reverse lg:flex-row  lg:justify-center  items-center gap-2 w-full ">
        <Button asChild className="w-full lg:w-auto ">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Join meeting
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Active;
