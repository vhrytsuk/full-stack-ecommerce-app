"use client";

import { Button } from "@repo/ui/components/button";

export function SignInSubmitButton({
  label,
  pending,
}: {
  label: string;
  pending: boolean;
}) {
  return (
    <Button
      type='submit'
      className='w-full'
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? `${label}…` : label}
    </Button>
  );
}
