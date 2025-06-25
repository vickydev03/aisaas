import React, { useState } from "react";
import { MeetingGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MeetingInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import GenerateAvartar from "@/components/GenerateAvatar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CommandSelect from "./CommandSelect";
import NewAgentsDialog from "@/modules/agents/ui/component/NewAgentsDialog";

interface Props {
  onSuccess?: (id?: string) => void;
  onCancel?: (val: boolean) => void;
  intialvalues?: MeetingGetOne;
}

function MeetingsForm({ onSuccess, onCancel, intialvalues }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getmany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );

        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    })
  );
  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getmany.queryOptions({})
        );

        if (intialvalues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: intialvalues.id })
          );
        }

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        // todo
      },
    })
  );

  const form = useForm<z.infer<typeof MeetingInsertSchema>>({
    resolver: zodResolver(MeetingInsertSchema),
    defaultValues: {
      name: intialvalues?.name ?? "",
      agentId: intialvalues?.agentId ?? "",
    },
  });

  const isEdit = !!intialvalues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = (values: z.infer<typeof MeetingInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: intialvalues.id });
    } else {
      createMeeting.mutate(values);
    }
  };
  const [agentSearch, setAgentSearch] = useState("");
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState<boolean>(false);
  const { data: agents } = useQuery(
    trpc.agents.getmany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    })
  );

  console.log(agents, "test");

  return (
    <>
      <NewAgentsDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />
      <Form {...form}>
        <form className=" space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g python professor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents?.items ?? []).map((e) => ({
                      id: e.id,
                      value: e.id,
                      children: (
                        <div className=" flex items-center  gap-x-2 ">
                          <GenerateAvartar
                            seed={e.name}
                            variant="botttsNeutral"
                            className="border size-6"
                          />
                          <span>{e.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline "
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    {" "}
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex  justify-between gap-x-2">
            {onCancel && (
              <Button
                disabled={isPending}
                type="button"
                variant={"ghost"}
                onClick={() => onCancel(false)}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={isPending}
              type="submit"
              // variant={"ghost"}
              onClick={() => onCancel}
            >
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default MeetingsForm;
