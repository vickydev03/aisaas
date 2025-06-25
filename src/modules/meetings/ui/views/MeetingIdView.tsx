"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { useState } from "react";
import MeetingIdViewHeader from "../component/MeetingIdViewHeader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/modules/agents/hooks/useConfirm";
import UpdateMeetingDialog from "../component/UpdateMeetingDialog ";
import Upcoming from "../component/state/Upcoming";
import Active from "../component/state/Active";
import Cancel from "../component/state/Cancel";
import Processing from "../component/state/Processing";
import Completed from "../component/state/Completed";
interface Props {
  meetingId: string;
}
function MeetingIdView({ meetingId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  // const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({}));
  const deleteMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: async() => {
       await  queryClient.invalidateQueries(trpc.meetings.getmany.queryOptions({}));
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    `the following action will remove meeting`
  );

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    await deleteMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isCancel = data.status === "cancelled";
  const isComplete = data.status === "completed";
  const isprocessing = data.status === "processing";
  const isUpcoming = data.status === "upcoming";

  return (
    <>
      <ConfirmDialog />
      <UpdateMeetingDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        intialvalues={data}
      />
      <div className="flex flex-1 py-4 px-4 md:px-8 flex-col gap-y-4 ">
        <MeetingIdViewHeader
          meetingId={data.id}
          meetingName={data.name}
          onEdit={() => setIsOpen(true)}
          onRemove={handleDelete}
        />
        {isUpcoming && (
          <Upcoming
            meetingId={data.id}
            // onCancelMeeting={() => {}}
            // isCancelling={true}
          />
        )}
        {isActive && (
          <Active
            meetingId={data.id}
            // onCancelMeeting={() => {}}
            // isCancelling={true}
          />
        )}
        {isCancel && <Cancel />}
        {isprocessing && <Processing />}
        {isComplete && <Completed data={data} />}
      </div>
    </>
  );
}

export default MeetingIdView;
