"use server";

import { registerResponseSchema } from "@repo/api-contracts";
import { redirect } from "next/navigation";

import {
  ApiError,
  parseJson,
  saveAuthenticationTokens,
  serverFetch,
} from "@/shared/api";

import { signUpSchema } from "../model/signUpSchema";
import { type SignUpFormState } from "../model/signUpTypes";

function getOptionalString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Sign-up Server Action (BFF).
 *
 * Server Actions are public endpoints, so submitted data is validated here
 * with the shared Zod contract before hitting the backend. On success, tokens
 * returned by the backend are stored as BFF-owned HttpOnly cookies.
 */
export async function signUpAction(
  _prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: getOptionalString(formData.get("name")),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();

    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
        name: fieldErrors.name,
      },
    };
  }

  try {
    const response = await serverFetch("/auth/register", {
      method: "POST",
      body: parsed.data,
      auth: false,
    });

    const payload = registerResponseSchema.parse(await parseJson(response));

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
          error.status === 409 ? "Email is already registered." : error.message,
      };
    }

    console.error("[signUpAction] Unexpected error:", error);

    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  redirect("/");
}
