import { registerUserSchema } from "@repo/api-contracts";
import type { z } from "zod";

/**
 * Client-side form validation schema for sign-up.
 *
 * We reuse the shared backend contract (`registerUserSchema`) so the browser
 * and server validate against the same rules.
 */
export const signUpSchema = registerUserSchema;

export type SignUpValues = z.infer<typeof signUpSchema>;
