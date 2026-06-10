# Fiorisce - E-Commerce Florist Website

Modern e-commerce platform for Fiorisce Florist built with Next.js 16, TypeScript, and Prisma.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint, Prettier

## Architecture

### Project Structure
```
app/
├── (auth)/              # Authentication pages (login, register)
├── (main)/              # Public pages with main layout
├── admin/               # Admin dashboard
├── api/                 # API routes
├── components/          # Reusable components
│   ├── ui/             # UI primitives
│   ├── features/       # Feature components
│   ├── layout/         # Layout components
│   ├── product/        # Product components
│   ├── cart/           # Cart components
│   └── admin/          # Admin components
├── lib/                # Utilities and configurations
└── types/              # TypeScript type definitions

prisma/
└── schema.prisma       # Database schema
```

### Key Modules

1. **Authentication & Authorization** - User login/register, OAuth (Google), RBAC
2. **Product Catalogue** - Product listing, categories, search, filters, tags
3. **Shopping Cart & Checkout** - Cart management, checkout flow, address management
4. **Payment Integration** - Midtrans gateway, multiple payment methods
5. **Order Management** - Order tracking, status updates, history
6. **Admin Dashboard** - Product/Order/User CRUD, reports, logs

## Database Schema

MySQL database with entities: Users, Products, Categories, Orders, Payments, Cart, Addresses. See `prisma/schema.prisma`.

## Getting Started

### Prerequisites
- Node.js 20+
- MySQL 8.0+

### Installation

1. Install dependencies
```bash
npm install
```

2. Setup environment variables
```bash
cp .env.example .env
```

Edit `.env`:
- `DATABASE_URL`: MySQL connection
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

3. Setup database
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Development

### Code Quality
```bash
npm run lint
```

### Database
```bash
npx prisma studio    # Open database GUI
npx prisma migrate dev --name migration_name
```

## Deployment

Deploy on Vercel, Fly.io, or VPS with MySQL database.

## License

Private - Fiorisce Florist © 2026
