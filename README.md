# ElevenX

A Next.js dashboard for managing ElevenLabs AI agents, tools, knowledge bases, phone numbers, call logs, and analytics via the PicaOS passthrough API.

## Getting Started

### Prerequisites

You need valid PicaOS credentials to run this app:
- `PICA_SECRET_KEY` — your Pica secret
- `PICA_ELEVENLABS_CONNECTION_KEY` — your ElevenLabs connection key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and add:
   ```
   PICA_SECRET_KEY=your_secret_key_here
   PICA_ELEVENLABS_CONNECTION_KEY=your_connection_key_here
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

## Architecture

### Security: PicaOS Secrets Stored Server-Side

The app uses a **proxy pattern** to keep Pica credentials safe:

1. **Client pages** (`src/app/(dashboard)/**`) call `Pica.*` methods from `src/lib/pica.ts`
2. `Pica.*` makes HTTP requests to Next.js route handlers under `src/app/api/pica/**`
3. Route handlers call `src/lib/pica.server.ts` (server-only), which:
   - Injects required Pica headers (`x-pica-secret`, `x-pica-connection-key`, `x-pica-action-id`)
   - Forwards requests to PicaOS (`https://api.picaos.com/v1/passthrough/v1`)
   - Returns responses to the client

**The browser never calls PicaOS directly**, so secrets are never exposed.

### Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **UI**: Radix UI, Shadcn/ui, Lucide React icons
- **Styling**: Tailwind CSS 4
- **Theme**: next-themes (dark/light mode)
- **Utilities**: date-fns, recharts

### File Structure

```
src/
├── app/
│   ├── (dashboard)/        # Main app routes
│   │   ├── agents/
│   │   ├── tools/
│   │   ├── knowledge/
│   │   ├── calls/
│   │   ├── analytics/
│   │   └── phone-numbers/
│   └── api/pica/           # Server-side PicaOS proxy handlers
├── components/
│   ├── ui/                 # Shadcn UI primitives
│   ├── agents/             # Agent selectors (voice, tools, knowledge)
│   └── layout/             # Sidebar, theme toggle
└── lib/
    ├── pica.ts             # Browser client (calls /api/pica/*)
    ├── pica.server.ts      # Server-only PicaOS client
    └── utils.ts            # Utility functions
```
