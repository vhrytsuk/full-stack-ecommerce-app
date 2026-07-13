"use server";

import type { LoginResponse } from "@repo/api-contracts";
import { redirect } from "next/navigation";

import {
  ApiError,
  forwardSetCookies,
  parseJson,
  serverFetch,
} from "@/shared/api";

import { type SignInFormState } from "../model/signInTypes";
import { signInSchema } from "../model/signInSchema";

/**
 * Sign-in Server Action (BFF).
 *
 * Server Actions are public endpoints, so credentials are always validated
 * here with the shared Zod contract before hitting the backend. On success the
 * backend's HttpOnly session cookies are forwarded to the browser, keeping
 * tokens out of client JavaScript.
 */
export async function signInAction(
  _prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
    };
  }

  try {
    const response = await serverFetch("/auth/login", {
      method: "POST",
      body: parsed.data,
    });

    // Validate the response shape via the shared contract, then hand the
    // backend's HttpOnly cookies to the browser.
    await parseJson<LoginResponse>(response);
    await forwardSetCookies(response);
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message:
          error.status === 401 ? "Invalid email or password." : error.message,
      };
    }

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // `redirect` throws internally, so it must live outside the try/catch above.
  redirect("/");
}
