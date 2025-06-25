import { DEFAULT_PAGE } from "@/constant";
import { createLoader, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import { MeetingStatus } from "../types";

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
export const loadMeetingFilter = createLoader(params);
