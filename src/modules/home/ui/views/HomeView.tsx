"use client";

import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
// import React from "react";

function HomeView() {
  const { data } = authClient.useSession();

  if (!data?.user) {
    // redirect("/sign-in")
    redirect("/sign-in");
  } else {
    redirect("/agents");
  }
}

export default HomeView;
