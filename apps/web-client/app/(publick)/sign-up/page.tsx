import Link from "next/link";

import { SignUpForm } from "@/features/auth/signUp";
import { getCurrentLocale, getDictionary } from "@/shared/i18n";

export default async function Page() {
  const t = await getDictionary(getCurrentLocale());
  const signUp = t.auth.signUp;

  return (
    <main className='container-storefront flex min-h-[70vh] items-center justify-center py-12'>
      <div className='w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm'>
        <div className='mb-6 flex flex-col gap-1'>
          <h1 className='text-xl font-semibold tracking-tight'>
            {signUp.title}
          </h1>
          <p className='text-sm text-muted-foreground'>{signUp.subtitle}</p>
        </div>

        <SignUpForm
          labels={{
            nameLabel: signUp.nameLabel,
            namePlaceholder: signUp.namePlaceholder,
            emailLabel: signUp.emailLabel,
            emailPlaceholder: signUp.emailPlaceholder,
            passwordLabel: signUp.passwordLabel,
            submit: signUp.submit,
          }}
        />

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {signUp.hasAccount}{" "}
          <Link href='/sign-in' className='text-primary hover:underline'>
            {signUp.signInLink}
          </Link>
        </p>
      </div>
    </main>
  );
}
