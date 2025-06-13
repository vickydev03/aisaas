// import { SignupView } from "@/modules/auth/ui/views/SignupView";
import { auth } from "@/lib/auth";
import { SignUpView } from "@/modules/auth/ui/views/SignupView";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session  =await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }
  return (
    <SignUpView/>
  );
}

export default page;
