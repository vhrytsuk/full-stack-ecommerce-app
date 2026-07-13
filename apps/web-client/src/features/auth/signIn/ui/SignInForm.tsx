"use client";

import { useActionState, useState } from "react";

import { Field } from "@repo/ui/components/forms/field";

import { signInAction } from "../api/signIn";
import { initialSignInState } from "../model/signInTypes";
import { signInSchema } from "../model/signInSchema";
import { SignInSubmitButton } from "./SignInSubmitButton";

export type SignInFormLabels = {
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  submit: string;
};

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function SignInForm({ labels }: { labels: SignInFormLabels }) {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialSignInState
  );
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  // Server errors are the source of truth after a submit; client-side checks
  // only pre-empt an obviously invalid request.
  const emailError = clientErrors.email ?? state.fieldErrors?.email?.[0];
  const passwordError =
    clientErrors.password ?? state.fieldErrors?.password?.[0];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const parsed = signInSchema.safeParse({
      email: new FormData(event.currentTarget).get("email"),
      password: new FormData(event.currentTarget).get("password"),
    });

    if (!parsed.success) {
      event.preventDefault();
      const { fieldErrors } = parsed.error.flatten();
      setClientErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setClientErrors({});
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className='flex flex-col gap-4'
    >
      {state.status === "error" && state.message ? (
        <p role='alert' className='text-sm text-destructive'>
          {state.message}
        </p>
      ) : null}

      <Field
        id='email'
        name='email'
        type='email'
        autoComplete='email'
        label={labels.emailLabel}
        placeholder={labels.emailPlaceholder}
        error={emailError}
      />

      <Field
        id='password'
        name='password'
        type='password'
        autoComplete='current-password'
        label={labels.passwordLabel}
        error={passwordError}
      />

      <SignInSubmitButton label={labels.submit} pending={pending} />
    </form>
  );
}
