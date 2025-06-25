import React from "react";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import AgentsForm from "./AgentsForm";
import { AgentGetOne } from "../../types";

interface Props {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  intialvalues?: AgentGetOne;
}
function UpdateAgentsDialog({ open, onOpenChange,intialvalues }: Props) {
  return (
    <ResponsiveDialog
      title="Edit agents"
      description="Edit the  agents details"
      onOpenChange={onOpenChange}
      open={open}
    >
      <AgentsForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        intialvalues={intialvalues}
      />
    </ResponsiveDialog>
  );
}

export default UpdateAgentsDialog;
