import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { Dictionary } from "@/shared/i18n";

export function HeaderLogo({ t }: { t: Dictionary }) {
  return (
    <Link
      href='/'
      className='flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground'
      aria-label={t.header.home}
    >
      <ShoppingBag className='size-6 text-primary' aria-hidden='true' />
      <span>{t.common.brand}</span>
    </Link>
  );
}
