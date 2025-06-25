import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import AgentsViews from "@/modules/agents/ui/views/AgentsViews";
import { Suspense } from "react";
import LoadingState from "@/components/LoadingState";
import ListHeader from "@/modules/agents/ui/component/ListHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadAgentsFilter } from "@/modules/agents/hooks/searchParams";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}
export default async function Home({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/sign-in");
  }

  const filters = await loadAgentsFilter(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.agents.getmany.queryOptions({ ...filters })
  );

  return (
    <>
      <ListHeader />
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
    </>
  );
}
