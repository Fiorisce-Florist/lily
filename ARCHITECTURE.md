# Fiorisce - Development Guidelines

## Architecture Principles

This project follows Clean Architecture and Domain-Driven Design principles:

### 1. **Separation of Concerns**

- **Presentation Layer** (`app/components`, `app/(auth)`, `app/(main)`): UI components and pages
- **Business Logic Layer** (`app/lib`, `app/api`): Business rules and API routes
- **Data Layer** (`prisma/schema.prisma`): Database models and queries

### 2. **Folder Structure**

```
app/
├── (auth)/                    # Route group for authentication
│   ├── login/
│   └── register/
├── (main)/                    # Route group for public pages
│   ├── products/
│   ├── cart/
│   └── checkout/
├── admin/                     # Admin dashboard routes
├── api/                       # API routes
│   ├── auth/
│   ├── products/
│   └── orders/
├── components/
│   ├── ui/                   # Reusable UI primitives (buttons, inputs)
│   ├── features/             # Feature-specific components
│   ├── layout/               # Layout components (navbar, footer)
│   ├── product/              # Product-related components
│   ├── cart/                 # Cart-related components
│   └── admin/                # Admin-specific components
├── lib/                      # Shared utilities
│   ├── prisma.ts            # Prisma client singleton
│   ├── auth.ts              # NextAuth configuration
│   └── utils.ts             # Helper functions
└── types/                    # TypeScript type definitions
```

### 3. **Component Organization**

- **UI Components**: Small, reusable components (Button, Input, Card)
- **Feature Components**: Business logic components (ProductCard, CartItem)
- **Page Components**: Route-specific components

### 4. **API Routes Structure**

```
app/api/
├── auth/[...nextauth]/       # Authentication endpoints
├── products/                 # Product CRUD
│   ├── route.ts             # GET /api/products, POST /api/products
│   └── [id]/
│       └── route.ts         # GET, PATCH, DELETE /api/products/:id
├── cart/                     # Cart operations
└── orders/                   # Order management
```

### 5. **Database Layer**

- Use Prisma ORM for type-safe database access
- Define relationships clearly in schema
- Use transactions for operations affecting multiple tables
- Implement soft deletes where appropriate

### 6. **State Management**

- Server Components by default (Next.js 16)
- Client Components only when needed (forms, interactivity)
- Use React Server Actions for mutations
- URL state for filters and pagination

### 7. **Security Best Practices**

- Input validation on all forms
- SQL injection prevention via Prisma
- XSS protection (React escapes by default)
- CSRF protection via NextAuth
- Rate limiting on API routes
- Role-based access control

### 8. **Performance Optimization**

- Image optimization via Next.js Image component
- Lazy loading for heavy components
- Database query optimization (select only needed fields)
- Caching strategies for product listings
- Static generation where possible

### 9. **Code Style**

- TypeScript strict mode enabled
- ESLint + Prettier for code formatting
- Functional components with hooks
- Async/await over promises
- Explicit return types for functions

### 10. **Testing Strategy**

- Unit tests for business logic
- Integration tests for API routes
- E2E tests for critical user flows
- Mock external services (payment gateway)

## Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement feature with tests
   - Run linter and tests locally
   - Create pull request

2. **Code Review**
   - At least one approval required
   - Check for architectural consistency
   - Verify test coverage
   - Ensure documentation is updated

3. **Deployment**
   - Automated CI/CD via GitHub Actions
   - Staging environment for testing
   - Production deployment after approval

## Naming Conventions

- **Files**: kebab-case (`product-card.tsx`)
- **Components**: PascalCase (`ProductCard`)
- **Functions**: camelCase (`getProductById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CART_ITEMS`)
- **Database**: snake_case (`user_id`, `created_at`)

## Module Dependencies

```
Presentation Layer
    ↓
Business Logic Layer
    ↓
Data Layer
```

Never allow Data Layer to depend on Presentation Layer.
