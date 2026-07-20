# Web Client Architecture

This document defines the agreed architecture for `apps/web-client`.
Use it when adding routes, business domains, UI composition, data fetching,
authentication, or shared frontend code.

## Architecture

The storefront uses a pragmatic FSD-lite structure adapted to the Next.js App
Router:

```text
app  → widgets → features → entities → shared
```

Dependencies must flow from left to right. A lower layer must not import a
higher layer.

Examples:

- `features` may import `entities` and `shared`.
- `entities` may import `shared`.
- `shared` must not import from another FSD layer.

`packages/ui` and other workspace packages sit outside these layers and may be
used where appropriate.

## Naming

- Use camelCase for slice and segment folders: `signIn`, `productDetails`,
  `addToCart`.
- Use PascalCase for React component files: `SignInForm.tsx`.
- Use camelCase for non-component files: `signInSchema.ts`, `getProduct.ts`.
- Group features by business domain first:

```text
features/
├── auth/
│   └── signIn/
└── product/
    ├── addToCart/
    └── selectVariant/
```

Do not place all features in one flat directory.

## Layer Responsibilities

### `app`

Owns Next.js routing and framework conventions:

- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- route handlers
- route groups
- metadata

Routes should be thin. A page normally imports a view and passes route
parameters to it. Do not put reusable business logic or large component trees
in `page.tsx`.

### `widgets`

Owns large reusable page sections composed from entities and features.

Examples:

- `siteHeader`
- `siteFooter`
- `productGrid`
- `productFilters`
- `productDetails`
- `cartSummary`

A widget should represent a meaningful section, not a generic visual wrapper.

### `features`

Owns user actions and business workflows.

Examples:

- `features/auth/signIn`
- `features/product/addToCart`
- `features/product/selectVariant`
- `features/product/addToWishlist`
- `features/cart/applyCoupon`

A feature commonly contains:

```text
featureName/
├── api/       # Mutation/query specific to the action
├── model/     # Schema, state, hooks, and feature types
├── ui/        # Interactive UI that starts or displays the action
└── index.ts   # Optional public API, added only when useful
```

Do not create empty standard folders automatically. Add a segment only when
the feature needs it.

### `entities`

Owns reusable business objects and their basic representation.

Examples:

- `product`
- `user`
- `session`
- `cart`
- `category`

An entity may contain:

```text
product/
├── api/       # getProduct, getProducts
├── model/     # Product types and schemas
├── lib/       # Product-specific pure helpers
├── ui/        # ProductCard, ProductPrice, ProductRating
└── index.ts
```

An entity describes or displays a business object. A user action involving that
object belongs in a feature.

### `shared`

Owns application-specific infrastructure with no business-domain knowledge:

- API client and normalized API errors
- environment/config helpers
- generic hooks
- framework helpers
- generic types

Generic visual primitives belong in `packages/ui`, not
`apps/web-client/src/shared/ui`.

## Server and Client Components

Use Server Components by default.

Add `"use client"` only to components that need:

- event handlers
- browser APIs
- React client state or effects
- client-only libraries

Keep client boundaries near interactive leaves. Do not mark a complete view or
page as a Client Component only because one nested button is interactive.

Typical product page:

```text
ProductDetailsPage       Server
└── ProductDetailsView   Server
    └── ProductDetails   Server-compatible widget
        ├── ProductPrice             Server-compatible entity UI
        ├── ProductVariantSelector   Client feature
        └── AddToCartButton          Client feature
```

Fetch independent server data in parallel and use route or component Suspense
boundaries where streaming improves the page.

## Sign-In Reference Structure

```text
app/
└── (auth)/
    └── sign-in/
        ├── page.tsx
        ├── loading.tsx
        └── error.tsx

src/
├── features/
│   └── auth/
│       └── signIn/
│           ├── api/
│           │   └── signIn.ts
│           ├── model/
│           │   ├── signInSchema.ts
│           │   └── signInTypes.ts
│           ├── ui/
│           │   ├── SignInForm.tsx
│           │   └── SignInSubmitButton.tsx
│           └── index.ts
└── entities/
    ├── session/
    │   ├── api/
    │   ├── model/
    │   │   ├── sessionStore.ts
    │   │   ├── sessionTypes.ts
    │   │   └── useSession.ts
    │   └── index.ts
    └── user/
        ├── model/
        │   └── userTypes.ts
        └── index.ts
```

Responsibilities:

- `SignInView`: complete page composition.
- `SignInForm`: fields, submission state, and displayed errors.
- `signInSchema`: Zod input validation.
- `signIn.ts`: authentication request and response normalization.
- `session`: current authenticated user and session lifecycle.
- `user`: reusable user representation.

Validate credentials on the server even when client-side validation exists.

### Token and Session Rules

Preferred production design:

- Treat the Next.js web client as the BFF boundary for browser authentication.
- Backend auth endpoints return validated token payloads; they do not need to
  issue browser cookies directly.
- Persist access and refresh tokens only from Server Actions or Route Handlers
  using `HttpOnly`, `Secure`, appropriately configured `SameSite` cookies.
- Never store refresh tokens in `localStorage`, persisted Zustand/Redux state,
  or JavaScript-readable cookies.
- Server-side API helpers may read the access token cookie and send it to the
  backend as a bearer token. When refreshing, forward only the refresh token to
  the backend and persist the rotated tokens returned in the response.

For Server Component authentication, prefer this secure cookie/BFF session
design. Browser memory is unavailable to Server Components and is cleared by a
full page refresh.

## Product Reference Structure

```text
src/
├── entities/
│   └── product/
│       ├── api/
│       │   ├── getProduct.ts
│       │   └── getProducts.ts
│       ├── lib/
│       │   └── formatProductPrice.ts
│       ├── model/
│       │   ├── productSchema.ts
│       │   └── productTypes.ts
│       ├── ui/
│       │   ├── ProductCard.tsx
│       │   ├── ProductImage.tsx
│       │   ├── ProductPrice.tsx
│       │   └── ProductRating.tsx
│       └── index.ts
├── features/
│   └── product/
│       ├── addToCart/
│       │   ├── model/
│       │   │   └── useAddToCart.ts
│       │   ├── ui/
│       │   │   └── AddToCartButton.tsx
│       │   └── index.ts
│       └── selectVariant/
│           ├── model/
│           │   └── useSelectedVariant.ts
│           ├── ui/
│           │   └── ProductVariantSelector.tsx
│           └── index.ts
├── widgets/
│   ├── productGrid/
│   └── productDetails/
```

Classification examples:

| Code                                         | Layer                            |
| -------------------------------------------- | -------------------------------- |
| `ProductCard`, `ProductPrice`, product types | `entities/product`               |
| `AddToCartButton`                            | `features/product/addToCart`     |
| `ProductVariantSelector`                     | `features/product/selectVariant` |
| `ProductGrid`, related products section      | `widgets`                        |

Prefer product reads in Server Components. Pass the smallest serializable data
required into interactive feature components.

## Public APIs and Imports

Use a slice `index.ts` when it creates a stable boundary:

```ts
export { SignInForm } from "./ui/SignInForm";
export { signInSchema } from "./model/signInSchema";
```

Consumers then import from the slice:

```ts
import { SignInForm } from "@/features/auth/signIn";
```

Avoid broad application-level barrel files. They obscure dependency direction
and may increase bundles.

For shared UI, use direct package subpath imports:

```ts
import { Button } from "@repo/ui/components/button";
```

## Rules to Prevent Future Problems

- Do not duplicate backend contracts when `packages/api-contracts` already owns
  the schema or type.
- Do not put business-specific components into `packages/ui`.
- Do not put feature actions inside entities.
- Do not make `shared` a miscellaneous dumping ground.
- Do not create a global client store for server-fetched product data by
  default.
- Do not expose server-only environment variables or tokens to Client
  Components.
- Do not import another feature's internal files. Compose features in widgets.
- Add tests beside the slice they cover, such as `model/*.test.ts` or
  `ui/*.test.tsx`.
- Add public APIs only when a slice has real exports.
- Prefer explicit, direct imports over large global barrels.
