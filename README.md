# Prodfind

A modern, full-stack product discovery platform built with Next.js 15, enabling users to discover, bookmark, and recommend products.

## Features

- **Product Discovery**: Browse and discover products with rich metadata
- **User Authentication**: Multi-provider authentication (Google OAuth, email/password, passkeys, 2FA)
- **Bookmarks & Recommendations**: Save favorite products and recommend to others
- **Real-time Notifications**: Get notified about product activity
- **File Uploads**: Upload product images with UploadThing integration
- **Bot Protection**: Vercel BotID integration for secure mutations
- **Responsive Design**: Modern UI with Tailwind CSS and Radix UI

## Tech Stack

### Core Technologies
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Drizzle ORM
- **API**: tRPC for type-safe end-to-end APIs
- **Authentication**: Better-auth with multi-provider support
- **UI**: Tailwind CSS with Radix UI components
- **File Uploads**: UploadThing
- **Bot Protection**: Vercel BotID

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd prodfind
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Configure your database, auth providers, and other services
```

4. Set up the database:
```bash
pnpm db:auth:generate
pnpm db:generate
pnpm db:migrate
```

## Development

Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard
│   ├── (home)/            # Public pages
│   └── api/               # API routes
├── components/            # React components (feature-organized)
├── lib/                   # Core utilities, DB connection, auth config
├── trpc/                  # tRPC routers and configuration
├── types/                 # TypeScript schemas and types
└── drizzle/              # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

More on [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License ([LICENSE](LICENSE))