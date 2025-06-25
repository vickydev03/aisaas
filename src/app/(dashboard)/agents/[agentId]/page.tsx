import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import AgentIdView from "@/modules/agents/ui/component/AgentIdView";
import { getQueryClient, trpc } from "@/trpc/server";
import {
  dehydrate,

  HydrationBoundary,
  
} from "@tanstack/react-query";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{ agentId: string }>;
}
async function page({ params }: Props) {
  const { agentId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading agents"
            description="This may takes few seconds"
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error Loading agents"
              description="Something went wrong"
            />
          }
        >
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
