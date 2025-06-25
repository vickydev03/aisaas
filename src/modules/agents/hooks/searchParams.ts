import { DEFAULT_PAGE } from "@/constant";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

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
export const loadAgentsFilter = createLoader(params);
