"use client";
// import ResponsiveDialog from "@/components/ResponsiveDialog";
// import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { DataTable } from "../component/DataTable";
import { columns } from "../component/Coulmns";
import EmptyState from "@/components/EmptyState";
import { useAgentsFilters } from "../../hooks/useAgentsFilterHook";
import DataPagination from "../../../../components/DataPagination";
import { useRouter } from "next/navigation";

function AgentsViews() {
  const trpc = useTRPC();
  const [filters, setFilters] = useAgentsFilters();
  const { data } = useSuspenseQuery(
    trpc.agents.getmany.queryOptions({
      ...filters,
    })
  );
  console.log(data);
  const router = useRouter();

  return (
    <>
      {/* <ResponsiveDialog
        onOpenChange={() => {}}
        open={false}
        title={"test"}
        description="test description "
      >
        <Button>click me</Button>
      </ResponsiveDialog> */}

      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        <DataTable
          data={data.items}
          columns={columns}
          onRowClick={(row) => router.push(`/agents/${row.id}`)}
        />
        <DataPagination
          page={filters.page}
          totalPage={data.totalPage}
          onPageChange={(page) => setFilters({ page })}
        />
        {data.items.length === 0 && (
          <EmptyState
            title="Create your first agents"
            description="Create an agents to join the meeting.Each agents will follow your instructions and can interect with participants"
          />
        )}
      </div>
    </>
  );
}

export default AgentsViews;
