"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import NewAgentsDialog from "./NewAgentsDialog";
import { useAgentsFilters } from "../../hooks/useAgentsFilterHook";
import AgentSearchFilters from "./AgentSearchFilters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ListHeader() {
  const [filters, setFilters] = useAgentsFilters();
  const [isOpen, setIsopen] = useState(false);

  const isFiltersModified = filters.search.length > 1;

  return (
    <>
      <NewAgentsDialog onOpenChange={setIsopen} open={isOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex  items-center justify-between  ">
          <h5 className="font-medium  text-xl ">My Agents</h5>

          <Button
            className="bg-primary text-white "
            onClick={() => setIsopen(true)}
          >
            <PlusIcon />
            New Agents
          </Button>
        </div>
        <ScrollArea>
        <div className=" flex items-center gap-x-2 p-1">
          <AgentSearchFilters />
          {isFiltersModified && (
            <Button
            size={"sm"}
              variant={"outline"}
              onClick={() => setFilters({ search: "" })}
            >
              <XCircleIcon className="size-3" />
              Clear
            </Button>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

export default ListHeader;
