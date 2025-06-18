"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import NewAgentsDialog from "./NewAgentsDialog";

function ListHeader() {
  const [isOpen, setIsopen] = useState(false);
  return (
    <>
      <NewAgentsDialog onOpenChange={setIsopen} open={isOpen} />
      <div className="px-4 py-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex  items-center justify-between  ">
          <h5 className="font-medium  text-xl ">My Agents</h5>

          <Button className="bg-primary text-white " onClick={()=>setIsopen(true)}>
            <PlusIcon />
            New Agents
          </Button>
        </div>
      </div>
    </>
  );
}

export default ListHeader;
