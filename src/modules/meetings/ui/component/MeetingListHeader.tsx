"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
// import NewAgentsDialog from "./NewAgentsDialog";
// import NewAgentsDialog from "@/modules/agents/ui/component/NewAgentsDialog";
import NewMeetingDialog from "./NewMeetingDialog";
import MeetingearchFilters from "./MeetingSearchFilters";
import StatusFilters from "./StatusFilters";
import AgentIdFilters from "./AgentIdFilters";
import { useMeetingFilters } from "../../hooks/useMeetingFilterHook";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
function MeetingListHeader() {
  //   const [filters, setFilters] = useAgentsFilters();
  const [isOpen, setIsopen] = useState(false);
  const [filters, setFilters] = useMeetingFilters();

  const isFiltersModified =
    filters.agentId || filters.page || filters.search || filters.status;
  //   const isFiltersModified = filters.search.length > 1;

  return (
    <>
      <NewMeetingDialog onOpenChange={setIsopen} open={isOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex  items-center justify-between  ">
          <h5 className="font-medium  text-xl ">My Meetings</h5>

          <Button
            className="bg-primary text-white "
            onClick={() => setIsopen(true)}
          >
            <PlusIcon />
            New Meetings
          </Button>
        </div>
          <ScrollArea>
        <div className=" flex items-center gap-x-2 p-1">
            <MeetingearchFilters />
            <StatusFilters />
            <AgentIdFilters />
            {isFiltersModified && (
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() =>
                  setFilters({ search: "", agentId: "", page: 1, status: null })
                }
              >
                <XCircleIcon className="size-3" />
                Clear
              </Button>
            )}
            <ScrollBar orientation="horizontal" />
        </div>
          </ScrollArea>
      </div>
    </>
  );
}

export default MeetingListHeader;
