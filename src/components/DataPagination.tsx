import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  page: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}
function DataPagination({ page, totalPage, onPageChange }: Props) {
  return (
    <div className="flex items-center  justify-between">
      <div className="text-muted-foreground  flex-1  text-sm  ">
        Page {page} of {totalPage || 1}
      </div>
      <div className="flex  items-center  justify-end  space-x-2 py-4  ">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className=""
          disabled={page == 1}
        >
          Previous
        </Button>
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => onPageChange(Math.min(totalPage, page + 1))}
          disabled={page == totalPage || totalPage == 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DataPagination;
