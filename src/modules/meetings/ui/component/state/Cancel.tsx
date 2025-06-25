import EmptyState from "@/components/EmptyState";
import React from "react";

function Cancel() {
  return (
    <div className="bg-white rounded-lg px-4 py-5  flex flex-col  gap-y-8 items-center justify-center   ">
      <EmptyState
        image="/upcoming.svg"
        title="Cancel thè meeting"
        description="This meeting was cancelled"
      />
    </div>
  );
}

export default Cancel;
