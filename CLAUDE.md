# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager
Use **pnpm** for all package management operations.

## Common Development Commands

### Development & Building
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Production build with Turbopack
- `pnpm build:prod` - Production build without linting
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Operations (Drizzle)
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:auth:generate` - Generate Better-auth schema

## Architecture Overview

**Prodfind** is a Next.js 15 full-stack product discovery platform with the following key architectural components:

### Core Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe end-to-end APIs
- **Authentication**: Better-auth with multi-provider support (Google, email/password, passkeys, 2FA)
- **UI**: Tailwind CSS with Radix UI components
- **File Uploads**: UploadThing
- **Bot Protection**: BotID for mutation protection

### Directory Structure
- `src/app/` - Next.js App Router with grouped routes:
  - `(auth)/` - Login/register pages
  - `(dashboard)/` - Authenticated user dashboard
  - `(home)/` - Public marketing pages
  - `api/` - API routes for auth, trpc, uploads
- `src/components/` - Feature-organized React components
- `src/lib/` - Core utilities, database connection, auth config
- `src/trpc/` - tRPC routers and configuration
- `src/types/` - TypeScript schemas and types
- `drizzle/` - Database migrations and snapshots

### Data Flow Patterns
- **Authentication**: Better-auth handles sessions, stored in database via Drizzle adapter
- **API Layer**: tRPC routers in `src/trpc/routers/` with `baseProcedure` and `authedProcedure`
- **Database**: Drizzle schema in `src/lib/db/schema/` with relations between users, products, bookmarks, recommendations
- **Type Safety**: Zod schemas in `src/types/` ensure runtime validation matches TypeScript types

### Key Features
- **Product Management**: CRUD operations with author permissions, categories, links, images
- **User Interactions**: Bookmarks and recommendations with notification system
- **File Handling**: Product images via UploadThing integration
- **Security**: Bot protection on mutations, session-based auth, SQL injection prevention via Drizzle

### Authentication Flow
- Multiple providers via Better-auth (Google OAuth, email/password, passkeys)
- Email verification required for email/password accounts
- Session management through database with automatic cleanup
- 2FA and admin plugins enabled

### Database Schema
- `users` - Better-auth managed user accounts
- `products` - Core product data with JSON fields for images/links/categories
- `bookmarks` - User-product bookmark relationships
- `recommendations` - User-product recommendation relationships  
- `notifications` - Activity notifications for users

### tRPC Endpoints Structure
Main router in `src/trpc/routers/_app.ts` includes:
- Product CRUD operations with authorization checks
- Bookmark/recommendation management
- User session management
- Notification system
- Contact form handling

## Important Development Notes

### Use tRPC for API Endpoints
All new API functionality should use tRPC routers. The main app router is in `src/trpc/routers/_app.ts`.

### Bot Protection
All mutations that modify data include BotID verification. This pattern should be maintained for new mutations.

### Database Operations
Use Drizzle ORM for all database operations. Schema files are in `src/lib/db/schema/` and the database connection is exported from `src/lib/db.ts`.

### Component Organization
Components are organized by feature area (auth, dashboard, product, etc.) with shared UI components in `src/components/ui/`.

### Type Safety
Maintain end-to-end type safety using Zod schemas in `src/types/` that correspond to database schemas.

## **DONT DOWN UX**
Please do not down user experience.