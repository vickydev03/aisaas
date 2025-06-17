import { AlertCircleIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

import React from "react";

function ErrorState({ title, description }: Props) {
  return (
    <div className=" py-4 px-8  flex flex-1  items-center justify-center h-full w-full ">
      <div className="flex flex-col  items-center  justify-center gap-y-6  bg-background  rounded-lg shadow-sm p-10 ">
        <AlertCircleIcon className=" size-6  text-red-500 " />
        <div className="  flex flex-col gap-y-2  text-center">
          <h6 className="text-lg font-medium">{title}</h6>
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorState;
