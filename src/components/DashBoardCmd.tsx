import React, { SetStateAction, Dispatch, useState } from "react";

import {
  CommandEmpty,
  CommandGroup,
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function DashBoardCmd({ open, setOpen }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const trpc = useTRPC();

  const agents = useQuery(
    trpc.agents.getmany.queryOptions({
      search: search,
      pageSize: 100,
    })
  );
  const meetings = useQuery(
    trpc.meetings.getmany.queryOptions({
      search: search,
      pageSize: 100,
    })
  );

  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="find a meeting with agents"
        value={search}
        onValueChange={(e) => setSearch(e)}
      />
      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-muted-foreground  text-sm ">
              No meeting found
            </span>
          </CommandEmpty>
          {meetings.data?.items.map((meeting) => (
            <CommandItem
            key={meeting.id}
              onSelect={() => {
                router.push(`/meetings/${meeting.id}`);
                setOpen(false);
              }}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-muted-foreground  text-sm ">
              No agent found
            </span>
          </CommandEmpty>
          {agents.data?.items.map((agent) => (
            <CommandItem
            key={agent.id}
              onSelect={() => {
                router.push(`/agents/${agent.id}`);
                setOpen(false);
              }}
            >
              {agent.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
}

export default DashBoardCmd;
