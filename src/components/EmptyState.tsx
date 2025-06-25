import Image from "next/image";

interface Props {
  title: string;
  description: string;
  image?:string
}

import React from "react";

function EmptyState({ title, description,image= "/empty.svg"}: Props) {
  return (
    <div className="  flex flex-col  items-center justify-center h-full w-full ">
      <Image src={image} alt="no results" width={240} height={240} />
      <div className="  flex flex-col gap-y-6 max-w-md text-center mx-auto ">
        <h6 className="text-lg font-medium">{title}</h6>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
