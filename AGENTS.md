# CPF Exception Tracker

## Identity

- **Stack**: Vite 8, React 19, TypeScript 5.9, shadcn/ui (new-york), Tailwind CSS 4, React Router 7, Papaparse 5
- **Scaffolded from**: templateCentral/templates/vite-react
- **Created**: 2026-04-20
- **Type**: Client-side SPA (no SSR, no backend, no auth)

## Architecture Decisions

- Routes defined in `src/router.tsx` — Dashboard (`/`), My Tasks (`/my-tasks`), Upload CSV (`/upload`)
- All data stored in `localStorage` under key `cpf_exceptions`; seed data auto-loaded on first visit via `SEEDED_KEY` flag
- Feature module: `src/features/exceptions/` owns all types, store CRUD, seed data, and UI components
- No auth, no TanStack Query (data is synchronous localStorage), no backend calls
- Navbar includes "Reset Demo Data" button to re-seed with fresh randomised data

## Key Conventions

- Named exports only
- `function` declarations for components; `const` arrows for hooks/utilities
- kebab-case filenames, PascalCase exports
- `noUncheckedIndexedAccess: true` — always use `as Type` or fallback `?? default` on array index access
- Static data (names, NRICs, exception details) lives in `seed-data.ts`, not inline

## Feature: Exceptions

| File | Purpose |
|------|---------|
| `types.ts` | `ExceptionItem`, `ExceptionStatus`, `ExceptionType`, `TEAM_MEMBERS` |
| `seed-data.ts` | `generateSeedData()` — 30 realistic items across 5 exception types |
| `store.ts` | localStorage CRUD: `initStore`, `resetStore`, `getItems`, `saveItems`, `updateItemStatus`, `addRemark`, `appendItems` |
| `components/status-badge.tsx` | Colour-coded status badge |
| `components/summary-cards.tsx` | Total / Open / Resolved / Pending Escalation cards |
| `components/exceptions-table.tsx` | Clickable table with row → detail panel |
| `components/exception-detail-panel.tsx` | Side panel: actions (Contact, Escalate, Resolve), add remark, history |

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | `DashboardPage` | Summary cards + filtered table of all items |
| `/my-tasks` | `MyTasksPage` | User selector dropdown + items for selected user |
| `/upload` | `UploadPage` | CSV drag-and-drop upload with Papaparse, sample download |

## Project-Specific Notes

- POC for CPF Board replacing a GovTech tracking tool — demo/presentation use only
- Seed statuses: ~20 New, 5 In Progress, 3 Contacting Member, 2 Resolved (with history and remarks)
- CSV upload round-robins `assigned_to` across the 5 team members starting from current item count
- No data validation on NRIC format beyond non-empty check (intentional for demo speed)
