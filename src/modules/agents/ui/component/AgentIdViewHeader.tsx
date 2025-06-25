import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import {
  ChevronRightIcon,
  TrashIcon,
  PencilIcon,
  MoreVertical,
} from "lucide-react";

interface Props {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
}
function AgentIdViewHeader({ agentId, agentName, onEdit, onRemove }: Props) {
  return (
    <div className="flex items-center  justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-medium text-xl " asChild>
              <Link href={`/agents`}>My agents</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className=" text-foreground  font-medium   text-xl [&>svg]:size-4 ">
            <ChevronRightIcon className="" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="font-medium text-xl text-foreground "
              asChild
            >
              <Link href={`/agents/${agentId}`}>{agentName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"}>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-background py-2 px-2 space-y-3 w-36  rounded-lg  "
        >
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-4 px-2 py-1 border-none outline-none hover:bg-neutral-50"
          >
            <PencilIcon className="size-4 text-black " />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="flex items-center gap-4 px-2 py-1 border-none outline-none hover:bg-neutral-50"
          >
            <TrashIcon className="size-4 text-black  " />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AgentIdViewHeader;
