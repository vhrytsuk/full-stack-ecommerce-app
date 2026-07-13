/**
 * Result returned by the sign-in Server Action, consumed by the form via
 * `useActionState`. Kept serializable to cross the server/client boundary.
 */
export type SignInFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

export const initialSignInState: SignInFormState = { status: "idle" };
