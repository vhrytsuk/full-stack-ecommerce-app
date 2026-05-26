/**
 * prisma/seed.ts — Database seeder for products, categories, and variants
 *
 * Run:
 *   npx prisma db seed
 *
 * Or manually:
 *   npx ts-node prisma/seed.ts
 *
 * Add to package.json:
 *   "prisma": {
 *     "seed": "ts-node prisma/seed.ts"
 *   }
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma-client/client.js";
import { ProductStatus } from "../src/generated/prisma-client/enums.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the seed script");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function sku(...parts: string[]): string {
  return parts.map((p) => p.toUpperCase().replace(/\s+/g, "-")).join("-");
}

// ─── Categories ───────────────────────────────────────────────────────────────

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: { name: "Clothing", slug: "clothing" },
  });

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });

  // Sub-categories
  const tshirts = await prisma.category.upsert({
    where: { slug: "clothing-t-shirts" },
    update: {},
    create: {
      name: "T-Shirts",
      slug: "clothing-t-shirts",
      parentId: clothing.id,
    },
  });

  const hoodies = await prisma.category.upsert({
    where: { slug: "clothing-hoodies" },
    update: {},
    create: {
      name: "Hoodies",
      slug: "clothing-hoodies",
      parentId: clothing.id,
    },
  });

  const phones = await prisma.category.upsert({
    where: { slug: "electronics-phones" },
    update: {},
    create: {
      name: "Phones",
      slug: "electronics-phones",
      parentId: electronics.id,
    },
  });

  console.log("✅ Categories done");
  return { clothing, electronics, tshirts, hoodies, phones };
}

// ─── Product factories ────────────────────────────────────────────────────────

/**
 * Creates a product with color + size variants (clothing).
 * Generates every color × size combination automatically.
 */
async function createVariantProduct({
  name,
  description,
  categoryId,
  price,
  colors,
  sizes,
  status = ProductStatus.ACTIVE,
}: {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  colors: string[];
  sizes: string[];
  status?: ProductStatus;
}) {
  const productSlug = slug(name);

  const product = await prisma.product.upsert({
    where: { slug: productSlug },
    update: {},
    create: {
      name,
      slug: productSlug,
      description,
      status,
      categoryId,
      images: {
        create: [
          {
            url: `https://picsum.photos/seed/${productSlug}-1/800/800`,
            position: 0,
          },
          {
            url: `https://picsum.photos/seed/${productSlug}-2/800/800`,
            position: 1,
          },
        ],
      },
      tags: {
        create: [
          {
            tag: {
              connectOrCreate: {
                where: { name: "new-arrival" },
                create: { name: "new-arrival" },
              },
            },
          },
        ],
      },
      optionTypes: {
        create: [
          {
            name: "Color",
            position: 0,
            values: {
              create: colors.map((c, i) => ({ value: c, position: i })),
            },
          },
          {
            name: "Size",
            position: 1,
            values: {
              create: sizes.map((s, i) => ({ value: s, position: i })),
            },
          },
        ],
      },
    },
    include: { optionTypes: { include: { values: true } } },
  });

  // Build every color × size combination as a variant
  const colorType = product.optionTypes.find((o) => o.name === "Color")!;
  const sizeType = product.optionTypes.find((o) => o.name === "Size")!;

  let isFirst = true;
  for (const colorValue of colorType.values) {
    for (const sizeValue of sizeType.values) {
      const variantSku = sku(name, colorValue.value, sizeValue.value);

      await prisma.variant.upsert({
        where: { sku: variantSku },
        update: {},
        create: {
          productId: product.id,
          sku: variantSku,
          price,
          comparePrice: Math.random() > 0.5 ? price * 1.2 : null, // 50% chance of a "was" price
          costPrice: price * 0.4,
          stock: Math.floor(Math.random() * 80) + 10,
          lowStockAt: 5,
          weight: 300,
          isDefault: isFirst,
          options: {
            create: [
              { optionValueId: colorValue.id },
              { optionValueId: sizeValue.id },
            ],
          },
          images: {
            create: [
              {
                url: `https://picsum.photos/seed/${variantSku}/800/800`,
                altText: `${name} in ${colorValue.value}`,
                position: 0,
              },
            ],
          },
        },
      });

      isFirst = false;
    }
  }

  console.log(`  ✔ ${name} — ${colors.length * sizes.length} variants`);
  return product;
}

/**
 * Creates a simple product with no options — single default variant.
 */
async function createSimpleProduct({
  name,
  description,
  categoryId,
  price,
  stock = 999,
  status = ProductStatus.ACTIVE,
}: {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock?: number;
  status?: ProductStatus;
}) {
  const productSlug = slug(name);
  const variantSku = sku(name);

  const product = await prisma.product.upsert({
    where: { slug: productSlug },
    update: {},
    create: {
      name,
      slug: productSlug,
      description,
      status,
      categoryId,
      images: {
        create: [
          {
            url: `https://picsum.photos/seed/${productSlug}/800/800`,
            position: 0,
          },
        ],
      },
      // No optionTypes — simple product
      variants: {
        create: {
          sku: variantSku,
          price,
          costPrice: price * 0.5,
          stock,
          isDefault: true,
          weight: 200,
        },
      },
    },
  });

  console.log(`  ✔ ${name} — simple product`);
  return product;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Starting seed...\n");

  const { tshirts, hoodies, phones } = await seedCategories();

  console.log("\n🌱 Seeding products...");

  // Clothing — variant products
  await createVariantProduct({
    name: "Classic Cotton T-Shirt",
    description: "Everyday essential. 100% organic cotton, pre-shrunk.",
    categoryId: tshirts.id,
    price: 29.99,
    colors: ["White", "Black", "Navy", "Red"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  });

  await createVariantProduct({
    name: "Graphic Logo T-Shirt",
    description: "Bold front print on heavyweight cotton.",
    categoryId: tshirts.id,
    price: 34.99,
    colors: ["Black", "White", "Grey"],
    sizes: ["S", "M", "L", "XL"],
  });

  await createVariantProduct({
    name: "Pullover Hoodie",
    description: "Midweight fleece. Kangaroo pocket, adjustable drawstring.",
    categoryId: hoodies.id,
    price: 64.99,
    colors: ["Black", "Charcoal", "Olive", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  });

  await createVariantProduct({
    name: "Zip-Up Hoodie",
    description: "Full-zip fleece with ribbed cuffs.",
    categoryId: hoodies.id,
    price: 74.99,
    colors: ["Navy", "Grey", "Black"],
    sizes: ["S", "M", "L", "XL"],
    status: ProductStatus.DRAFT, // not yet live
  });

  // Electronics — simple products
  await createSimpleProduct({
    name: "USB-C Charging Cable 2m",
    description: "100W fast charge, braided nylon, 2 metre.",
    categoryId: phones.id,
    price: 19.99,
    stock: 500,
  });

  await createSimpleProduct({
    name: "Wireless Charger Pad 15W",
    description: "Qi-certified. Compatible with all Qi-enabled devices.",
    categoryId: phones.id,
    price: 39.99,
    stock: 200,
  });

  await createSimpleProduct({
    name: "Phone Stand Adjustable",
    description: "Aluminium desk stand. Fits phones 4–7 inches.",
    categoryId: phones.id,
    price: 24.99,
    stock: 150,
  });

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
