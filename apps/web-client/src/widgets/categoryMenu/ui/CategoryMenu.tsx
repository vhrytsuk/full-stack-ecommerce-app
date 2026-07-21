"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import type { CategoryTreeNode } from "@/entities/category";

export type CategoryMenuLabels = {
  trigger: string;
  title: string;
  allProducts: string;
};

export function CategoryMenu({
  categories,
  labels,
}: {
  categories: CategoryTreeNode[];
  labels: CategoryMenuLabels;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={labels.trigger}>
          <LayoutGrid className='size-5' aria-hidden='true' />
        </Button>
      </SheetTrigger>

      <SheetContent side='left' className='w-80 max-w-[85vw]'>
        <SheetHeader>
          <SheetTitle>{labels.title}</SheetTitle>
        </SheetHeader>

        <nav aria-label={labels.title} className='overflow-y-auto px-4 pb-6'>
          <SheetClose asChild>
            <Link
              href='/products'
              className='block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted'
            >
              {labels.allProducts}
            </Link>
          </SheetClose>

          <ul className='mt-1 flex flex-col'>
            {categories.map((category) => (
              <CategoryMenuItem
                key={category.id}
                category={category}
                onNavigate={close}
              />
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function CategoryMenuItem({
  category,
  onNavigate,
}: {
  category: CategoryTreeNode;
  onNavigate: () => void;
}) {
  return (
    <li>
      <Link
        href={`/categories/${category.slug}`}
        onClick={onNavigate}
        className='block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted'
      >
        {category.name}
      </Link>

      {category.children.length > 0 ? (
        <ul className='ml-3 border-l border-border pl-2'>
          {category.children.map((child) => (
            <CategoryMenuItem
              key={child.id}
              category={child}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
