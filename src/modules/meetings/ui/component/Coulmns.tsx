"use client";
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
// import humanizeDuration from "humanize-duration";
// import { AgentGetOne } from "../../types";
import GenerateAvartar from "@/components/GenerateAvatar";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  CornerDownRightIcon,
  ClockFadingIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MeetingGetMany } from "../../types";
import { cn, formateDuration } from "@/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancel: CircleXIcon,
};
const statusColorMap = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5 ",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5 ",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5 ",
  processing: "bg-rose-500/20 text-rose-800 border-rose-800/5 ",
  cancel: "bg-gray-500/20 text-gray-800 border-gray-800/5 ",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => {
      return (
        <div className=" flex flex-col gap-y-1">
          <span className="font-semibold capitalize ">{row.original.name}</span>
          <div className="flex  items-center gap-x-2">
            <div className=" flex  items-center gap-x-1">
              <CornerDownRightIcon className="size-3 text-muted-foreground" />
              <span className="text-sm max-w-[200px]  text-muted-foreground  truncate capitalize ">
                {row.original.agent.name}
              </span>
            </div>
            <GenerateAvartar
              variant="botttsNeutral"
              seed={row.original.name}
              className="size-4"
            />
            <span className="text-sm text-muted-foreground ">
              {row.original?.startedAt
                ? format(row.original?.startedAt, "MMM d")
                : " "}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon =
        statusIconMap[row.original.status as keyof typeof statusIconMap];
      const color =
        statusColorMap[row.original.status as keyof typeof statusIconMap];
      return (
        <Badge
          className={cn(
            " capitalize [&>svg]:size-4  text-muted-foreground",
            color
          )}
          variant={"outline"}
        >
          <Icon
            className={cn(
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
     
     
      return (
        <Badge
          className={cn(
            " capitalize [&>svg]:size-4  text-muted-foreground"
          )}
          variant={"outline"}
        >
          <ClockFadingIcon className="text-blue-700" />
          {row.original.duration
            ? formateDuration(row.original.duration)
            : "No duration"}
        </Badge>
      );
    },
  },
];
