"use client";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

function AgentsViews() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getmany.queryOptions());

  return (
    <>
      <ResponsiveDialog
        onOpenChange={() => {}}
        open={true}
        title={"test"}
        description="test description "
      >
        <Button>click me</Button>
      </ResponsiveDialog>
      {JSON.stringify(data, null, 2)}
    </>
  );
}

export default AgentsViews;
