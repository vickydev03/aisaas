"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, error } = authClient.useSession();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload

    authClient.signUp.email(
      {
        email,
        password,
        name: "Ajay",
      },
      {
        onError: () => {
          window.alert("Something went wrong");
        },
        onSuccess: () => {
          window.alert("Account created successfully!");
        },
      }
    );
  };

  if (session) {
    return (
      <div className="p-5">
        <p>You're logged in</p>
        <Button onClick={() => authClient.signOut()}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}

export default Page;
