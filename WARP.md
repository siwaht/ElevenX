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

- `src/lib/` - Utility functions and API client
  - `pica.ts` - PicaOS API client with typed methods for agents, tools, phone numbers, knowledge base, and analytics
  - `utils.ts` - Generic utility functions (cn for Tailwind class merging)

### Key Dependencies
- **Framework**: Next.js 16 (App Router), React 19
- **UI**: Radix UI components, Shadcn UI wrapper components, Lucide React icons
- **Styling**: Tailwind CSS 4, PostCSS
- **Utilities**: date-fns, recharts (for analytics), clsx/tailwind-merge
- **Theming**: next-themes for dark/light mode toggle

### Data Flow
1. **API Client** (`src/lib/pica.ts`) - Centralized PicaOS passthrough endpoints with hardcoded action IDs
2. **Components** - Fetch data directly from Pica client in page components (no centralized state management)
3. **UI Layer** - Renders data using Shadcn components; route-based navigation via sidebar

### Design System
- **Colors**: Tailwind defaults with accent colors (sky, violet, pink, orange, green, emerald) for different sections
- **Responsive**: Mobile-first approach with `md:` breakpoints; mobile sidebar via Sheet component
- **Theme**: Dark mode default with light mode toggle in sidebar footer
- **Typography**: Inter font family from Google Fonts

## Important Notes

### PicaOS Integration
- Base URL: `https://api.picaos.com/v1/passthrough/v1`
- All endpoints require headers: `x-pica-secret`, `x-pica-connection-key`, `x-pica-action-id`
- Action IDs are hardcoded in `pica.ts` - refer to ElevenLabs API docs if updating endpoints
- Environment variables: `PICA_SECRET_KEY`, `PICA_ELEVENLABS_CONNECTION_KEY`

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
4. For API calls, add methods to the `Pica` object in `src/lib/pica.ts` with appropriate action IDs
5. The sidebar automatically reflects all main routes defined in `src/components/layout/sidebar.tsx`
