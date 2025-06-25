import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useMeetingFilters } from "../../hooks/useMeetingFilterHook";

function MeetingearchFilters() {
  const [, setFilters] = useMeetingFilters();
  const [searchValue, setSearchValue] = useState("");

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTimeout(() => {
  //     setFilters({ search: e.target.value });
  //   }, 500);
  // };

  useEffect(() => {
    const searchSetTimeOut = setTimeout(() => {
      setFilters({search:searchValue})
    }, 500);

    return () => clearTimeout(searchSetTimeOut);
  }, [searchValue, setFilters]);
  return (
    <div className=" relative ">
      <Input
        placeholder="Filter by name"
        className="h-9  bg-white  w-[200px] pl-7 "
        value={searchValue}
        onChange={(e)=>setSearchValue(e.target.value)}
      />
      <SearchIcon className=" size-4  absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground " />
    </div>
  );
}

export default MeetingearchFilters;
