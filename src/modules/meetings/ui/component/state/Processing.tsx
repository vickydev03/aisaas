import EmptyState from "@/components/EmptyState";
import React from "react";

function Processing() {
  return (
    <div className="bg-white rounded-lg px-4 py-5  flex flex-col  gap-y-8 items-center justify-center   ">
      <EmptyState
        image="/processing.svg"
        title="processing data"
        description="Once Processed, a  summary will appear here"
      />
      
    </div>
  );
}

export default Processing;
