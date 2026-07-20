import "server-only";

import { cache } from "react";

import { parseJson, serverFetch } from "@/shared/api";

type CurrentUser = {
  id: string;
  email: string;
};

//TODO: refactore sign-in functionality, understande server actions how to clear save validate auth!
export const getMe = cache(async (): Promise<CurrentUser | null> => {
  const response = await serverFetch("/auth/me", {
    method: "GET",
  });

  if (response.status === 401) {
    return null;
  }

  return parseJson<CurrentUser>(response);
});
