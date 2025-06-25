import React from "react";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  // CornerDownRightIcon,
  // ClockFadingIcon,
  VideoIcon,
} from "lucide-react";
import CommandSelect from "./CommandSelect";
import { MeetingStatus } from "../../types";
import { useMeetingFilters } from "../../hooks/useMeetingFilterHook";

const optionFilters = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className=" flex items-center  gap-x-2  capitalize">
        <ClockArrowUpIcon />
        {MeetingStatus.Upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className=" flex items-center  gap-x-2  capitalize">
        <VideoIcon />
        {MeetingStatus.Active}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className=" flex items-center  gap-x-2  capitalize">
        <CircleXIcon />
        {MeetingStatus.Cancelled}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className=" flex items-center  gap-x-2  capitalize">
        <LoaderIcon />
        {MeetingStatus.Processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className=" flex items-center  gap-x-2  capitalize">
        <CircleCheckIcon />
        {MeetingStatus.Completed}
      </div>
    ),
  },
];
function StatusFilters() {
  const [filters, setFilters] = useMeetingFilters();

  return (
    <CommandSelect
      placeholder="Status"
      clasName="h-9 "
      options={optionFilters}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
      value={filters?.status ?? ""}
    />
  );
}

export default StatusFilters;
