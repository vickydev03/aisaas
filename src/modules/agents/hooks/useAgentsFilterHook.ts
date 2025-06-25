// "use client";
import { DEFAULT_PAGE } from "@/constant";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
// import {} from "nuqs/server";

export const sortValues = ["newest", "oldest", "default"] as const;
const params = {
  search: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  page: parseAsInteger
    .withDefault(DEFAULT_PAGE)
    .withOptions({ clearOnDefault: true }),
};
export const useAgentsFilters = () => {
  return useQueryStates(params);
};
