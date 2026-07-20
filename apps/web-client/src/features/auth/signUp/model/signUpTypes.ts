/**
 * Result returned by the sign-up Server Action, consumed by the form via
 * `useActionState`. Kept serializable to cross the server/client boundary.
 */
export type SignUpFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
};

export const initialSignUpState: SignUpFormState = { status: "idle" };
