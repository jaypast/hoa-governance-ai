# HOA Governance AI Agent

## Overview

This is an AI-powered research, governance, and document-drafting copilot designed for HOA board presidents and financial advisors. The application provides a research workspace for governance questions with cited answers, document drafting with pre-built templates, a knowledge base for browsing uploaded HOA documents, and settings for document management and team access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Animations**: Framer Motion for transitions and interactions
- **Fonts**: Space Grotesk (display), Inter (body), JetBrains Mono (code)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful JSON APIs under `/api/*` prefix
- **Build System**: Vite for client, esbuild for server bundling
- **Development**: Hot module replacement via Vite dev server

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Connection**: Uses `DATABASE_URL` environment variable

### File Upload System
- **Client**: Uppy with AWS S3 plugin for presigned URL uploads
- **Server**: Google Cloud Storage integration via Replit's object storage
- **Pattern**: Two-step presigned URL flow (request URL, then direct upload)

### Project Structure
- `client/src/` - React frontend application
- `server/` - Express backend with API routes
- `shared/` - Shared types and database schema
- `db/` - Database connection setup
- `migrations/` - Drizzle migration files

## External Dependencies

### Database
- PostgreSQL accessed via `DATABASE_URL` environment variable
- Drizzle ORM for type-safe database queries

### Cloud Storage
- Google Cloud Storage via Replit's sidecar endpoint (`http://127.0.0.1:1106`)
- Used for document uploads and file management

### GitHub Integration
- Octokit REST client for GitHub API access
- Replit connector for OAuth token management

### AI Services (Referenced but not fully implemented)
- OpenAI client included in dependencies
- Google Generative AI client included in dependencies
- Intended for research workspace AI responses

### Authentication
- Passport.js with passport-local strategy (in dependencies)
- Express session management with connect-pg-simple for PostgreSQL session storage

### Key NPM Packages
- `@tanstack/react-query` - Server state management
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `@google-cloud/storage` - Object storage
- `@uppy/core` / `@uppy/aws-s3` - File uploads
- `zod` - Schema validation
- `framer-motion` - Animations