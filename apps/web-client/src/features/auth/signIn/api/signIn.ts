"use server";

import { loginResponseSchema } from "@repo/api-contracts";
import { redirect } from "next/navigation";

import {
  ApiError,
  parseJson,
  saveAuthenticationTokens,
  serverFetch,
} from "@/shared/api";

import { type SignInFormState } from "../model/signInTypes";
import { signInSchema } from "../model/signInSchema";

/**
 * Sign-in Server Action (BFF).
 *
 * Server Actions are public endpoints, so credentials are always validated
 * here with the shared Zod contract before hitting the backend. On success,
 * tokens returned by the backend are stored as BFF-owned HttpOnly cookies.
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
      auth: false,
    });

    const payload = loginResponseSchema.parse(await parseJson(response));

    await saveAuthenticationTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      refreshTokenExpiresAt: payload.session.expiresAt,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        status: "error",
        message:
          error.status === 401 ? "Invalid email or password." : error.message,
      };
    }

    // Unexpected (non-API) failure — surface it in the server logs so it isn't
    // silently swallowed behind the generic message shown to the user.
    console.error("[signInAction] Unexpected error:", error);

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // `redirect` throws internally, so it must live outside the try/catch above.
  redirect("/");
}
