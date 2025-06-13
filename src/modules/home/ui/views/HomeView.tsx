"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React from "react";

function HomeView() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return <div className="p-5">loading...</div>;
  }

  return (
    <div className="p-5">
      <p>You're logged in</p>
      <Button onClick={() => authClient.signOut()}>Logout</Button>
    </div>
  );
}

export default HomeView;
