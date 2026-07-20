"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useMemo } from "react";
import { type FieldErrors, useForm } from "react-hook-form";

import { Field } from "@repo/ui/components/forms/field";
import { Button } from "@ui/components/button";

import { signUpAction } from "../api/signUp";
import { signUpSchema, type SignUpValues } from "../model/signUpSchema";
import { initialSignUpState } from "../model/signUpTypes";

export type SignUpFormLabels = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  submit: string;
};

function getServerErrors(
  state: typeof initialSignUpState
): FieldErrors<SignUpValues> | undefined {
  if (state.status !== "error" || !state.fieldErrors) {
    return undefined;
  }

  return {
    name: state.fieldErrors.name?.[0]
      ? { type: "server", message: state.fieldErrors.name[0] }
      : undefined,
    email: state.fieldErrors.email?.[0]
      ? { type: "server", message: state.fieldErrors.email[0] }
      : undefined,
    password: state.fieldErrors.password?.[0]
      ? { type: "server", message: state.fieldErrors.password[0] }
      : undefined,
  };
}

function optionalTextInput(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function SignUpForm({ labels }: { labels: SignUpFormLabels }) {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialSignUpState
  );
  const serverErrors = useMemo(() => getServerErrors(state), [state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
    errors: serverErrors,
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    if (values.name) {
      formData.set("name", values.name);
    }

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
        id='name'
        type='text'
        autoComplete='name'
        label={labels.nameLabel}
        placeholder={labels.namePlaceholder}
        error={errors.name?.message}
        {...register("name", { setValueAs: optionalTextInput })}
      />

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
        autoComplete='new-password'
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
        {pending ? `${labels.submit}...` : labels.submit}
      </Button>
    </form>
  );
}
