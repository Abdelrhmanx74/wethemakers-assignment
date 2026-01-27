"use client";

import { parseAsString, parseAsInteger, useQueryStates } from "nuqs";

export function useJobFilters() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      location: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
    },
    {
      history: "push",
    },
  );
}
