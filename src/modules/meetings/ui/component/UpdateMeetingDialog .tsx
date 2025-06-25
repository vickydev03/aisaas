import React from "react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import MeetingsForm from "./MeetingsForm";
import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  intialvalues: MeetingGetOne;
}
function UpdateMeetingDialog({ open, onOpenChange, intialvalues }: Props) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="Edit meeting"
      description="Edit the meeting details"
      onOpenChange={onOpenChange}
      open={open}
    >
      <MeetingsForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
        intialvalues={intialvalues}
      />
    </ResponsiveDialog>
  );
}

export default UpdateMeetingDialog;
