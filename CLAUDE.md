# CPF Exception Tracker

POC for CPF Board — localStorage-only SPA, no backend, no auth. Full context in `AGENTS.md`.

## Commands

```bash
pnpm dev        # http://localhost:3000
pnpm build      # tsc -b && vite build
pnpm test       # vitest run
pnpm lint       # eslint .
pnpm format     # prettier --write .
```

## templateCentral Skills

Skills live in `templateCentral/claude-skills/vite-react/`: `add-page`, `add-feature`, `add-component`, `add-form`, `add-integration`, `add-test`.

## Key Files

- `src/features/exceptions/` — all data types, localStorage store, seed data, components
- `src/router.tsx` — routes
- `vitest.config.ts` — test config (separate from `vite.config.ts` for Vite 8 compat)
