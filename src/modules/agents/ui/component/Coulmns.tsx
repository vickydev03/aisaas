"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AgentGetMany } from "../../types";
import GenerateAvartar from "@/components/GenerateAvatar";
import { CornerDownRightIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => {
      return (
        <div className=" flex flex-col gap-y-1">
          <div className=" flex  items-center gap-c-2 ">
            <GenerateAvartar
              variant="botttsNeutral"
              seed={row.original.name}
              className=" size-6"
            />
            <span className="font-semibold capitalize">
              {row.original.name}
            </span>
          </div>
          <div className="flex  items-center gap-x-2">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm max-w-[200px]  text-muted-foreground  truncate capitalize ">
              {row.original.instruction}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "meetingCount",
    header: "Meetings",
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className="flex items-center gap-y-2 [&>svg]:size-4"
        >
          <VideoIcon />
          {row.original.meetingCount}
          {row.original.meetingCount === 1 ? "meeting" : "meetings"}
        </Badge>
      );
    },
  },
];
