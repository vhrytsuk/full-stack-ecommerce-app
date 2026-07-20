"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useMemo } from "react";
import { type FieldErrors, useForm } from "react-hook-form";

import { Field } from "@repo/ui/components/forms/field";

import { signInAction } from "../api/signIn";
import { initialSignInState } from "../model/signInTypes";
import { signInSchema, type SignInValues } from "../model/signInSchema";
import { Button } from "@ui/components/button";

export type SignInFormLabels = {
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  submit: string;
};

function getServerErrors(
  state: typeof initialSignInState
): FieldErrors<SignInValues> | undefined {
  if (state.status !== "error" || !state.fieldErrors) {
    return undefined;
  }

  return {
    email: state.fieldErrors.email?.[0]
      ? { type: "server", message: state.fieldErrors.email[0] }
      : undefined,
    password: state.fieldErrors.password?.[0]
      ? { type: "server", message: state.fieldErrors.password[0] }
      : undefined,
  };
}

export function SignInForm({ labels }: { labels: SignInFormLabels }) {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialSignInState
  );
  const serverErrors = useMemo(() => getServerErrors(state), [state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    errors: serverErrors,
  });

  // RHF validates first; on success we forward the values to the Server Action.
  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className='flex flex-col gap-4'>
      {state.status === "error" && state.message ? (
        <p role='alert' className='text-sm text-destructive'>
          {state.message}
        </p>
      ) : null}

      <Field
        id='email'
        type='email'
        autoComplete='email'
        label={labels.emailLabel}
        placeholder={labels.emailPlaceholder}
        error={errors.email?.message}
        {...register("email")}
      />

      <Field
        id='password'
        type='password'
        autoComplete='current-password'
        label={labels.passwordLabel}
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        type='submit'
        className='w-full'
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? `${labels.submit}…` : labels.submit}
      </Button>
    </form>
  );
}
