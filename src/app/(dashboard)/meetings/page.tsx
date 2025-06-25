import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
// import AgentsViews from "@/modules/agents/ui/views/AgentsViews";
import { Suspense } from "react";
import LoadingState from "@/components/LoadingState";
// import ListHeader from "@/modules/agents/ui/component/ListHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { loadMeetingFilter } from "@/modules/meetings/hooks/searchParams";
import { SearchParams } from "nuqs";
import MeetingView from "@/modules/meetings/ui/views/MeetingView";
import { ErrorBoundary } from "react-error-boundary";
import ErrorState from "@/components/ErrorState";
import MeetingListHeader from "@/modules/meetings/ui/component/MeetingListHeader";

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

  const filters = await loadMeetingFilter(searchParams);
  
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getmany.queryOptions({...filters}));

  return (
    <>
      <MeetingListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState
              title="Loading meetings"
              description="This may take few seconds"
            />
          } 
        >
          <ErrorBoundary fallback={<ErrorState title="Error Loading Meeting" description="soemthing went wrong" />}>
            <MeetingView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
