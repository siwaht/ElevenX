# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**ElevenX** is a Next.js dashboard for managing ElevenLabs AI agents and related resources (phone numbers, tools, knowledge bases, calls, and analytics). The application provides a UI to interact with the ElevenLabs Conversational AI API via PicaOS passthrough endpoints.

## Common Commands

### Development
- `npm run dev` - Start dev server at http://localhost:3000
- `npm run build` - Build for production
- `npm start` - Start production server

### Quality & Testing
- `npm run lint` - Run ESLint on the codebase (uses Next.js and TypeScript configs)
- No test runner currently configured; tests would need to be added

## Architecture Overview

### Directory Structure
- `src/app/` - Next.js App Router with grouped routes via `(dashboard)` convention
  - Root `page.tsx` redirects to `/agents`
  - `(dashboard)/` - Main application routes (agents, phone-numbers, tools, knowledge, calls, analytics)
  - `layout.tsx` - Root layout with theme provider and global styles
  
- `src/components/` - Reusable React components
  - `ui/` - Shadcn/radix-ui primitives (button, dialog, input, tabs, etc.)
  - `layout/` - Layout components (Sidebar with mobile responsiveness)
  - `agents/` - Agent-specific selectors (knowledge, tools, voice)
  - `testing/` - Testing utilities (call-console)
  - `theme-provider.tsx` - Next-themes setup for dark/light mode

- `src/lib/` - Utilities and API clients
  - `pica.ts` - Browser-safe client wrapper that calls the app's `/api/pica/*` route handlers
  - `pica.server.ts` - Server-only PicaOS passthrough client (stores action IDs + adds secret headers)
  - `utils.ts` - Generic utility functions (cn for Tailwind class merging)

### Key Dependencies
- **Framework**: Next.js 16 (App Router), React 19
- **UI**: Radix UI components, Shadcn UI wrapper components, Lucide React icons
- **Styling**: Tailwind CSS 4, PostCSS
- **Utilities**: date-fns, recharts (for analytics), clsx/tailwind-merge
- **Theming**: next-themes for dark/light mode toggle

### Data Flow
1. **UI (client components)** calls `Pica.*` methods from `src/lib/pica.ts`.
2. `Pica.*` calls the Next.js route handlers under `src/app/api/pica/**`.
3. Route handlers call `src/lib/pica.server.ts`, which injects Pica headers (secret/connection/action-id) and forwards requests to PicaOS.

### Design System
- **Colors**: Tailwind defaults with accent colors (sky, violet, pink, orange, green, emerald) for different sections
- **Responsive**: Mobile-first approach with `md:` breakpoints; mobile sidebar via Sheet component
- **Theme**: Dark mode default with light mode toggle in sidebar footer
- **Typography**: Inter font family from Google Fonts

## Important Notes

### PicaOS Integration
- Upstream base URL (server-side only): `https://api.picaos.com/v1/passthrough/v1`
- All passthrough requests require headers: `x-pica-secret`, `x-pica-connection-key`, `x-pica-action-id` (set in `src/lib/pica.server.ts`).
- The browser never calls PicaOS directly; it calls `/api/pica/*` route handlers.
- Environment variables required on the server: `PICA_SECRET_KEY`, `PICA_ELEVENLABS_CONNECTION_KEY`.

### TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Path alias: `@/*` maps to `src/*`
- JSX: react-jsx

### ESLint
- Uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Development Workflow

1. Pages are grouped under `(dashboard)` - this is a Next.js route group and doesn't appear in URLs
2. Add new routes by creating folders/files under `src/app/(dashboard)/`
3. UI components can be generated or imported from `src/components/ui/` - these are Shadcn components and should follow the existing pattern
4. For new Pica endpoints, add a server method in `src/lib/pica.server.ts`, expose it via a route handler under `src/app/api/pica/**`, then call it from `src/lib/pica.ts`
5. The sidebar automatically reflects all main routes defined in `src/components/layout/sidebar.tsx`
