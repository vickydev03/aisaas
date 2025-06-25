import React, { useState } from "react";
import CommandSelect from "./CommandSelect";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
// import { AgentGetOne } from "@/modules/agents/types";
import { useMeetingFilters } from "../../hooks/useMeetingFilterHook";
import GenerateAvartar from "@/components/GenerateAvatar";

function AgentIdFilters() {
  const [filters, setFilters] = useMeetingFilters();
  const [agentSearch, setAgentSearch] = useState("");
  const trpc = useTRPC();
  const { data } = useQuery(trpc.agents.getmany.queryOptions({
    search:agentSearch
  }));

  const optionFilters = data?.items.map((e) => ({
    id: e.id,
    value: e.id,
    children: (
      <div className="flex  items-center gap-x-2">
        <GenerateAvartar
          className="size-3 "
          variant="botttsNeutral"
          seed={e.name}
        />
        <span>{e.name}</span>
      </div>
    ),
  }));
  return (
    <CommandSelect
      placeholder="Agent"
      clasName="h-9 "
      options={optionFilters ?? []}
      onSelect={(value) => setFilters({ agentId: value })}
      value={filters?.agentId ?? ""}
      onSearch={setAgentSearch}
    />
  );
}

export default AgentIdFilters;
