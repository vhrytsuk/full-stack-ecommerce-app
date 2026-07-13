import Link from "next/link";

import type { Dictionary } from "@/shared/i18n";

export function HeaderNav({ t }: { t: Dictionary }) {
  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/contact", label: t.nav.contact },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <nav aria-label='Primary' className='hidden md:block'>
      <ul className='flex items-center gap-6 text-sm font-medium'>
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
