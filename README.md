# Rojmel – Personal Money Tracker (React + Vite + Tailwind + MUI)

```bash
npm install
cp .env.example .env   # already included
npm run dev            # http://localhost:5173
npm run build
```
Demo login: values of VITE_DEMO_EMAIL / VITE_DEMO_PASSWORD in `.env`.

## Structure
- `src/config` env access
- `src/services` storage, authService, transactionService (replace with API calls later)
- `src/context` Auth, Toast, Settings, Finance
- `src/routes` ProtectedRoute
- `src/components/common` Button, Input, Switch, Pagination, ConfirmDialog, PageHeader, StatCard, EntryTable, EntryDialog, Layout
- `src/pages` Login, Dashboard, Daily, EntryPage (Income/Expenses/Petrol/Savings), Settings, NotFound
