import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { auth } from "@/lib/auth";
import UpgradeView from "@/modules/premium/ui/views/UpgradeView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.premium.getsCurrentSubscription.queryOptions()
  );
  void queryClient.prefetchQuery(trpc.premium.getProduct.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading product"
            description="wait for few seconds"
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error loading product "
              description="something went wrong"
            />
          }
        >
          <UpgradeView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}

export default page;
