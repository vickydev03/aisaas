import HomeView from "@/modules/home/ui/views/HomeView";
import React from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
async function page() {
  const session  =await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }
  return <HomeView />;
}

export default page;
