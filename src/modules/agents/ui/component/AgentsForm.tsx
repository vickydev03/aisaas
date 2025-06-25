import React from "react";
import { AgentGetOne } from "../../types";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { agentsInsertSchema } from "../../schema";
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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  intialvalues?: AgentGetOne;
}

function AgentsForm({ onSuccess, onCancel, intialvalues }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createAgents = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getmany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions()
        );

        // if (intialvalues?.id) {
        //   await queryClient.invalidateQueries(
        //     trpc.agents.getOne.queryOptions({ id: intialvalues.id })
        //   );
        // }

        // todo free tier

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    })
  );
  const updateAgents = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getmany.queryOptions({})
        );

        if (intialvalues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: intialvalues.id })
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

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: intialvalues?.name ?? "",
      instruction: intialvalues?.instruction ?? "",
    },
  });

  const isEdit = !!intialvalues?.id;
  const isPending = createAgents.isPending || updateAgents.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgents.mutate({ ...values, id: intialvalues.id });
    } else {
      createAgents.mutate(values);
    }
  };
  return (
    <Form {...form}>
      <form className=" space-y-4 " onSubmit={form.handleSubmit(onSubmit)}>
        <GenerateAvartar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className=" border size-16 flex items-center  justify-center
           "
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g ajay" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="instruction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instruction</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="you are a Math teacher who teaches students Math "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex  justify-between gap-x-2">
          {onCancel && (
            <Button
              disabled={isPending}
              type="button"
              variant={"ghost"}
              onClick={() => onCancel}
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
  );
}

export default AgentsForm;
