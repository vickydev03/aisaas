import React from "react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import AgentsForm from "./AgentsForm";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}
function NewAgentsDialog({ open, onOpenChange }: Props) {
  return (
    <ResponsiveDialog
      title="New agents"
      description="Create a new agents"
      onOpenChange={onOpenChange}
      open={open}
    >
      <AgentsForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)}   />
    </ResponsiveDialog>
  );
}

export default NewAgentsDialog;
