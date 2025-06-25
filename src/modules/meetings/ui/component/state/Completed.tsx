import { MeetingGetOne } from "@/modules/meetings/types";
import React from "react";
import Markdown from "react-markdown";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookOpenTextIcon,
  SparklesIcon,
  FileTextIcon,
  // FileVideoIcon,
  ClockFadingIcon,
} from "lucide-react";
import Link from "next/link";
import GenerateAvartar from "@/components/GenerateAvatar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { formateDuration } from "@/lib/utils";
// import Transcript from "./Transcript";

interface Props {
  data: MeetingGetOne;
}
function Completed({ data }: Props) {
  console.log(data, "data is here");

  return (
    <div className="flex  flex-col  gap-y-4 ">
      <Tabs defaultValue="summary">
        <div className=" rounded-lg bg-white  border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background  justify-start  rounded-none  h-13 ">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none  bg-background  data-[state=active]:shadow-none border-b-2  border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full  hover:text-accent-foreground "
              >
                <BookOpenTextIcon />
                Summary
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none  bg-background  data-[state=active]:shadow-none border-b-2  border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full  hover:text-accent-foreground "
              >
                <FileTextIcon />
                Transcript
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none  bg-background  data-[state=active]:shadow-none border-b-2  border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full  hover:text-accent-foreground "
              >
                <SparklesIcon />
                Recording
              </TabsTrigger>
              {/* <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none  bg-background  data-[state=active]:shadow-none border-b-2  border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full  hover:text-accent-foreground "
              >
                <SparklesIcon />
                Ask ai
              </TabsTrigger> */}
            </TabsList>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="recording">
          <div className="bg-white  rounded-lg  border px-4 py-5 ">
            <video
              src={data.recordingUrl!}
              className="w-full  rounded-lg"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="transcript">
          {/* <Transcript meetingId={data.id}/> */}
          <div className="w-full h-full flex items-center justify-center ">
            <h4 className="font-medium text-lg md:text-2xl  text-slate-400">Coming soon</h4>
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="bg-white rounded-lg  border">
            <div className="px-4 py-5 gap-y-5 col-span-5 flex flex-col">
              <h2 className="text-2xl font-medium capitalize ">{data.name}</h2>
              <div className="flex  gap-x-2 items-center">
                <Link
                  href={`/agents/${data.agentId}`}
                  className="flex items-center gap-x-0.5 flex-col"
                >
                  <div className="flex items-center pb-5">
                    {data.agent.name}
                    <GenerateAvartar
                      seed={data.agent.name}
                      variant="botttsNeutral"
                      className="size-5"
                    />
                  </div>
                  <p className="">
                    {data.startedAt ? format(data.startedAt, "PPP") : ""}
                  </p>
                </Link>
              </div>
              <div className="flex  gap-x-2 items-center">
                <SparklesIcon />
                <p>General summary</p>
              </div>
              <Badge
                variant={"outline"}
                className="flex items-center  gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon className="text-blue-700" />
                {data.duration ? formateDuration(data.duration) : "No duration"}
              </Badge>
              <div>
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl  font-medium  mb-6" {...props} />
                    ),
                    h2: (props) => (
                      <h1 className="text-xl  font-medium  mb-6" {...props} />
                    ),
                    h3: (props) => (
                      <h1 className="text-lg  font-medium  mb-6" {...props} />
                    ),
                    h4: (props) => (
                      <h1 className="text-base  font-medium  mb-6" {...props} />
                    ),
                    p: (props) => (
                      <p className=" leading-relaxed mb-6" {...props} />
                    ),
                    ul: (props) => (
                      <ul
                        className=" list-disc  list-inside  mb-6"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className=" list-decimal  list-inside  mb-6"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="mb-1" {...props} />,

                    strong: (props) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="bg-gray-100 rounded px-1 py-0.5"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 pl-4 italic  my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Completed;
