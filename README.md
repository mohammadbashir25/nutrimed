# Nutrimed 2.0

Nutrimed corporate website and private business-management dashboard. The public website remains in its own route group; the protected admin workspace is a sibling route group and does not inherit the public Navbar or Footer.

## Stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4
- MongoDB / Mongoose
- next-intl (English, Dari, Pashto)
- Framer Motion and Lucide React

## Requirements

- Node.js 20.9 or newer
- npm
- MongoDB Atlas or a MongoDB replica set (transactions are used for stock and payment consistency)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and configure:

   ```env
   MONGODB_URI=your-mongodb-replica-set-connection-string
   AUTH_SECRET=a-random-secret-at-least-32-characters-long
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ALLOW_ADMIN_BOOTSTRAP=false
   ```

   Generate an authentication secret with `openssl rand -base64 32`. Never commit `.env.local` or share database credentials.

3. Create the single administrator account:

   ```bash
   npm run create-admin
   ```

   This command prompts for the administrator's email, name, and password. Passwords must be at least 12 characters. The script refuses to create a second administrator.

4. Start the app:

   ```bash
   npm run dev
   ```

5. Open `/en/admin/login` (or `/fa/admin/login`, `/ps/admin/login`).

## Dashboard modules

- Overview
- Products
- Inventory
- Sales
- Purchases
- Customers
- Suppliers
- Expenses
- Finance
- Reports
- Website Management
- Settings

There is exactly one role: `ADMIN`. Dashboard pages and mutations require a signed, HTTP-only session cookie. Sessions expire after eight hours.

## Business rules implemented

- Currency presentation is AFN.
- Product records are database-backed; no seven-product seed data is inserted.
- Product opening stock and manual adjustments create stock movement records. Sales snapshot each product’s purchase cost so cost of goods sold is calculated independently of inventory purchases.
- Confirmed sales reduce stock; received purchases increase stock.
- Sales and purchase cancellation reverses stock in a transaction and is blocked when payments have been recorded.
- Partial payments update the linked invoice and payment ledger atomically.
- Customer and supplier balances are calculated from confirmed sales/received purchases and their recorded payments.
- Operating expenses are recorded separately from inventory purchases.
- Products, customers, and suppliers are archived rather than deleted, preserving transaction history.

## Public website

Routes: `/{locale}`, `/{locale}/about`, `/{locale}/products`, `/{locale}/products/[slug]`, `/{locale}/commitment`, and `/{locale}/contact`.

The public product catalogue reads only `PUBLISHED` products through `features/products/services/product.service.ts`. Product name and description fields support English, Dari, and Pashto. A product's SKU is used as the stable localized URL slug.

Website Management stores keyed localized content records (`en`, `fa`, `ps`) in MongoDB. The existing public copy remains translation-file driven; new content keys must be connected to the relevant public component before those keys alter rendered public copy.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
```

## Important deployment notes

- Use MongoDB Atlas or a replica set. A standalone MongoDB server does not support the multi-document transactions used for stock and payment operations.
- Set a unique, strong `AUTH_SECRET` in the deployment environment.
- Do not set `ALLOW_ADMIN_BOOTSTRAP=true` in production. The recommended administrator setup is the one-time CLI command.
- Do not commit `.env.local`, credentials, `node_modules`, `.next`, or build artifacts.


## Local setup after the dashboard and product updates

1. Copy `.env.example` to `.env.local` and fill in the real MongoDB URI, a strong `AUTH_SECRET`, and the public site URL.
2. Run `npm install` to install the new dependencies and generate a fresh `package-lock.json`.
3. To create the first administrator locally, temporarily set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (12+ characters), and optionally `ADMIN_NAME` in `.env.local`, then run `npm run create-admin`. Remove the password from the environment file after account creation.\n4. Connect a Vercel Blob store to the Vercel project. Vercel deployments can use the platform-provided Blob credentials; for local development, add `BLOB_READ_WRITE_TOKEN` to `.env.local`.
5. Run `npm run typecheck` and `npm run build` before deployment.

Product image uploads accept JPG, PNG, WEBP, and AVIF files up to 4 MB. The uploaded image is stored in Vercel Blob and its public URL is saved on the product record. Set the product status to **Published** to display it on the public product catalogue and homepage. Draft products remain private.

The admin Website/Content management screen has been removed. The public-facing website and public product pages remain in place.
