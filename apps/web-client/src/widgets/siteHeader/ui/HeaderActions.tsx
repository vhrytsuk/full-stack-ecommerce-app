import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import type { Dictionary } from "@/shared/i18n";

import { UserMenu } from "./UserMenu";

export function HeaderActions({ t }: { t: Dictionary }) {
  return (
    <div className='flex items-center gap-1'>
      <UserMenu t={t} />

      <Button
        variant='ghost'
        size='icon'
        aria-label={t.header.wishlist}
        asChild
      >
        <Link href='/wishlist'>
          <Heart className='size-5' aria-hidden='true' />
        </Link>
      </Button>

      <Button variant='ghost' size='icon' aria-label={t.header.basket} asChild>
        <Link href='/cart'>
          <ShoppingCart className='size-5' aria-hidden='true' />
        </Link>
      </Button>
    </div>
  );
}
