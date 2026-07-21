import { notFound } from "next/navigation";

import { getCategories, getCategoryProducts } from "@/entities/category";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getCategoryProducts(slug),
  ]);

  if (products === null) {
    notFound();
  }

  const category = categories.find((item) => item.slug === slug);

  return (
    <main className='container-storefront py-8'>
      <header className='mb-6'>
        <h1 className='type-heading-hero text-2xl font-semibold tracking-tight'>
          {category?.name ?? slug}
        </h1>
        {category?.description ? (
          <p className='mt-2 max-w-prose text-sm text-muted-foreground'>
            {category.description}
          </p>
        ) : null}
      </header>

      {products.length === 0 ? (
        <p className='text-sm text-muted-foreground'>
          No products in this category yet.
        </p>
      ) : (
        <section
          aria-label='Products'
          className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'
        >
          {/* TODO: replace with ProductCard from entities/product once available. */}
          {products.map((_, index) => (
            <div
              key={index}
              className='aspect-square rounded-lg border border-border bg-muted/30'
            />
          ))}
        </section>
      )}
    </main>
  );
}
