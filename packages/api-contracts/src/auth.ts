import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer")
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  createdAt: z.iso.datetime(),
});

export const authSessionSchema = z.object({
  id: z.string(),
  expiresAt: z.iso.datetime(),
});

export const registerResponseSchema = z.object({
  user: authUserSchema,
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  session: authSessionSchema,
});

export const loginResponseSchema = registerResponseSchema;
export const refreshResponseSchema = registerResponseSchema;

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
