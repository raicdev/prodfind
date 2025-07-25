# Contributing to Prodfind

Thank you for your interest in contributing to Prodfind! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/prodfind.git`
3. Install dependencies: `pnpm install`
4. Start development server: `pnpm dev`

## Development Setup

### Prerequisites
- Node.js 18.18+ 
- pnpm package manager
- PostgreSQL database

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure your database connection
3. Set up authentication providers (Google OAuth, etc.)
4. Run database migrations: `pnpm db:migrate`

## Development Workflow

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run linting: `pnpm lint`
4. Test your changes locally
5. Commit with descriptive messages
6. Push to your fork
7. Create a Pull Request

### Code Style
- Follow the existing code style and patterns
- Use TypeScript for all new code
- Maintain type safety with Zod schemas
- Use tRPC for API endpoints
- Follow the component organization in `src/components/`

### Database Changes
- Use Drizzle ORM for schema changes
- Generate migrations: `pnpm db:generate`
- Test migrations locally before submitting

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project conventions
- [ ] Linting passes (`pnpm lint`)
- [ ] Changes are tested locally
- [ ] Commit messages are descriptive
- [ ] PR description explains the changes

### PR Description Template
```
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] No breaking changes to existing functionality
```

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components organized by feature
- `src/lib/` - Utilities, database, auth configuration
- `src/trpc/` - tRPC API routers
- `src/types/` - TypeScript schemas and types
- `drizzle/` - Database migrations

## Key Technologies

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe APIs
- **Auth**: Better-auth with multi-provider support
- **UI**: Tailwind CSS with Radix UI
- **Package Manager**: pnpm

## Getting Help

- Check existing issues before creating new ones
- Join discussions in GitHub Issues
- Review the codebase documentation in CLAUDE.md

## License

By contributing, you agree that your contributions will be licensed under the project's license.