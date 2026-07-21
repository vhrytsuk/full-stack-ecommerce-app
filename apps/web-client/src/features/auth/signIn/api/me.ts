import "server-only";

import { cache } from "react";

import { parseJson, serverFetch } from "@/shared/api";

type CurrentUser = {
  id: string;
  email: string;
};

export const getMe = cache(async (): Promise<CurrentUser | null> => {
  const response = await serverFetch("/auth/me", {
    method: "GET",
  });

  if (response.status === 401) {
    return null;
  }

  return parseJson<CurrentUser>(response);
});
