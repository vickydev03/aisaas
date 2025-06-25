// "use client";
import { DEFAULT_PAGE } from "@/constant";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";
import { MeetingStatus } from "../types";
// import {} from "nuqs/server";

const params = {
  search: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),

  status: parseAsStringEnum(Object.values(MeetingStatus)),
  agentId: parseAsString.withDefault("").withOptions({clearOnDefault:true}),
};

export const useMeetingFilters = () => {
  return useQueryStates(params);
};
