"use client";
import { DataTable } from "@/components/DataTable";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { columns } from "../component/Coulmns";
import EmptyState from "@/components/EmptyState";
import { useMeetingFilters } from "../../hooks/useMeetingFilterHook";
import DataPagination from "@/components/DataPagination";
import { useRouter } from "next/navigation";

function MeetingView() {
  const [filters, setFilters] = useMeetingFilters();
  const trpc = useTRPC();
  const router=useRouter()
  const { data } = useSuspenseQuery(
    trpc.meetings.getmany.queryOptions({ ...filters })
  );
  return (
    <div className="flex-1 pb-4 px-4  md:px-8  flex flex-col  gap-y-4 ">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPage={data.totalPage}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect  with others. Each  meetings  lets you  collaborate ,share ideas,and interect with participants in real time  "
        />
      )}
    </div>
  );
}

export default MeetingView;
