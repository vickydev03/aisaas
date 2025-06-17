"use client";
import { useTRPC } from "@/trpc/client";
import {  useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

function AgentsViews() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getmany.queryOptions()
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export default AgentsViews;
