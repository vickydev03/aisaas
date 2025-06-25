import React from "react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import MeetingsForm from "./MeetingsForm";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}
function NewMeetingDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New meeting"
      description="Create a new meeting"
      onOpenChange={onOpenChange}
      open={open}
    >
      <MeetingsForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={()=>onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}

export default NewMeetingDialog;
