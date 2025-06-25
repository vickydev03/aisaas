import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

// import Highlighter from "react-highlight-words";

interface Props {
  meetingId: string;
}
function Transcript({ meetingId }: Props) {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );

  const [searchQuery, setSearchQuery] = useState("");
  // const filterData = (data ?? []).filter((e) =>
  //   e.text.toString().toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="bg-white  rounded-lg border px-4  py-5 flex flex-col  gap-y-4 w-full">
      <p className="text-sm font-medium ">Transcript</p>
      <div className=" relative">
        <Input
          className="pl-7  h-9  w-[240px]"
          value={searchQuery}
          placeholder="Search Transcript"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className=" absolute  left-2  top-1/2  -translate-y-1/2  size-4 text-muted-foreground " />
      </div>
      <ScrollArea>
        <div className="flex flex-col  gap-y-4 ">
          {JSON.stringify(data, null, 2)}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Transcript;
