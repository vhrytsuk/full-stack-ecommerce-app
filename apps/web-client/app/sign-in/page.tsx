import Link from "next/link";

import { getCurrentLocale, getDictionary } from "@/shared/i18n";
import { SignInForm } from "@/features/auth/signIn";

export default async function Page() {
  const t = await getDictionary(getCurrentLocale());
  const signIn = t.auth.signIn;

  return (
    <main className='container-storefront flex min-h-[70vh] items-center justify-center py-12'>
      <div className='w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm'>
        <div className='mb-6 flex flex-col gap-1'>
          <h1 className='text-xl font-semibold tracking-tight'>
            {signIn.title}
          </h1>
          <p className='text-sm text-muted-foreground'>{signIn.subtitle}</p>
        </div>

        <SignInForm
          labels={{
            emailLabel: signIn.emailLabel,
            passwordLabel: signIn.passwordLabel,
            emailPlaceholder: signIn.emailPlaceholder,
            submit: signIn.submit,
          }}
        />

        <p className='mt-4 text-center text-sm text-muted-foreground'>
          {signIn.noAccount}{" "}
          <Link href='/sign-up' className='text-primary hover:underline'>
            {signIn.signUpLink}
          </Link>
        </p>
      </div>
    </main>
  );
}
