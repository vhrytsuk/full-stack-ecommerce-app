import { loginUserSchema } from "@repo/api-contracts";
import type { z } from "zod";

/**
 * Client-side form validation schema for sign-in.
 *
 * We reuse the shared backend contract (`loginUserSchema`) so the browser and
 * server validate against the same rules. Do not duplicate the shape here.
 */
export const signInSchema = loginUserSchema;

export type SignInValues = z.infer<typeof signInSchema>;
