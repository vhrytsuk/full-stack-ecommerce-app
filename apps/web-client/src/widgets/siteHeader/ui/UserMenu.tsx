"use client";

import Link from "next/link";
import { LogIn, LogOut, Settings, User, UserRound } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import type { Dictionary } from "@/shared/i18n";

export function UserMenu({ t }: { t: Dictionary }) {
  // TODO: wire up real session state from entities/session once available.
  const isAuthenticated = false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={t.header.accountMenu}>
          <UserRound className='size-5' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>{t.header.myAccount}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/account'>
                <User className='size-4' aria-hidden='true' />
                {t.header.profile}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/account/settings'>
                <Settings className='size-4' aria-hidden='true' />
                {t.header.settings}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className='size-4' aria-hidden='true' />
              {t.header.signOut}
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>{t.header.welcome}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/sign-in' className='cursor-pointer'>
                <LogIn className='size-4' aria-hidden='true' />
                {t.header.signIn}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/sign-up' className='cursor-pointer'>
                <LogIn className='size-4' aria-hidden='true' />
                {t.header.signUp}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
