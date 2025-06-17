import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import AgentsViews from "@/modules/agents/ui/views/AgentsViews";
import { Suspense } from "react";
import LoadingState from "@/components/LoadingState";
export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getmany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading agents"
            description="This may take few seconds"
          />
        }
      >
        <AgentsViews />
      </Suspense>
    </HydrationBoundary>
  );
}
