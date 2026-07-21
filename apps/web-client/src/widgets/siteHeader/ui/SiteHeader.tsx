import { Suspense } from "react";

import { CategoryMenuTrigger } from "@/widgets/categoryMenu";
import { getCurrentLocale, getDictionary } from "@/shared/i18n";

import { HeaderActions } from "./HeaderActions";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderNav } from "./HeaderNav";

export async function SiteHeader() {
  const dictionary = await getDictionary(getCurrentLocale());

  return (
    <header className='sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur'>
      <div className='container-storefront flex h-16 items-center justify-between gap-4'>
        <div className='flex items-center gap-1'>
          <HeaderLogo t={dictionary} />
          <Suspense fallback={null}>
            <CategoryMenuTrigger />
          </Suspense>
        </div>
        <HeaderNav t={dictionary} />
        <HeaderActions t={dictionary} />
      </div>
    </header>
  );
}
