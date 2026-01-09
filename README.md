# HOA Governance AI Agent

A specialized AI agent that serves as a research, governance, and document-drafting copilot for HOA board presidents and financial advisors. Built with React, Express, and PostgreSQL.

## Features

### Research Workspace
- Ask governance questions with AI-powered responses
- Get cited answers from CC&Rs, bylaws, and Texas Property Code
- Real-time conversation with context-aware follow-ups

### Document Drafting
- Pre-built templates for policies, financials, and communications
- 209 Violation Letters, Board Resolutions, Budget Narratives
- All documents marked as drafts requiring board approval

### Knowledge Base
- Browse uploaded HOA documents (CC&Rs, bylaws, policies)
- Access Texas Property Code Chapters 201-209
- Dallas-specific reference materials

### Settings
- Document upload and management
- Team access controls
- AI guardrails configuration

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI, shadcn/ui

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string

## Legal Disclaimer

This AI agent is a research tool for board use only. All outputs are drafts for human approval and do not constitute legal advice. Always consult your HOA attorney for legal matters.

## License

MIT
