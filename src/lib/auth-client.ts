import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";
// import { polarClient } from "./polar";

export const authClient = createAuthClient({
  plugins: [polarClient()],
});
