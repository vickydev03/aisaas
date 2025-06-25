"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { useState } from "react";
import AgentIdViewHeader from "./AgentIdViewHeader";
import GenerateAvartar from "@/components/GenerateAvatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/useConfirm";
import UpdateAgentsDialog from "./UpdateAgentsDialog";

function AgentIdView({ agentId }: { agentId: string }) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const router = useRouter();
  const queryClient = useQueryClient();
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const removeAgents = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getmany.queryOptions({})
        );

        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );
        router.push("/agents");
        // invalid free teir useage
      },

      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    `the following action will remove all ${data.meetingCount} associated  meetings`
  );

  const handleRemoveAgent = async () => {
    const ok = await confirm();

    if (!ok) return;

    await removeAgents.mutateAsync({ id: agentId });
  };
  return (
    <>
      <ConfirmDialog />
      <UpdateAgentsDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        intialvalues={data}
      />
      <div className="flex flex-1 py-4 px-4 md:px-8  flex-col gap-y-4 ">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />
        <div className="bg-white rounded-lg   border ">
          <div className="px-4 py-5 gap-y-5  flex flex-col col-span-5">
            <div className=" flex items-center gap-x-3">
              <GenerateAvartar
                variant="botttsNeutral"
                seed={data.name}
                className="siz-10 "
              />
              <h2 className="text-2xl  font-medium ">{data.name}</h2>
            </div>
            <Badge
              variant={"outline"}
              className=" flex items-center gap-x-2 [&>svg]:size-4 "
            >
              <VideoIcon className="text-blue-700" />
              {data.meetingCount}
              {data.meetingCount === 1 ? "meeting" : "meetings"}
            </Badge>
            <div className=" flex  flex-col  gap-y-4 ">
              <p className=" text-lg  font-medium">Instruction</p>
              <p className=" text-neutral-800">{data.instruction}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgentIdView;
