# Metricly

An analytics dashboard built with React 19 and TypeScript. Features Firebase authentication, interactive charts, and a searchable user directory.

## Tech Stack

- **React 19** + **TypeScript**
- **Redux Toolkit** + **RTK Query**
- **Material UI 7** — light/dark theme
- **Recharts** — data visualisation
- **Firebase 12** — Google OAuth + email/password auth
- **React Router 7** — SPA routing
- **Vite + SWC** — bundler

## Pages

- **Dashboard** — KPI cards + user growth, age distribution, and country charts
- **Users** — sortable, filterable table with a detail drawer on row click
- **Analytics** — deep-dive charts (gender ratio, department headcount, age by gender, and more)

## Getting Started

```bash
npm install
npm run dev
```

Add a `.env` file with your Firebase credentials (see `.env.example`).

## Scripts

```bash
npm run dev      # Dev server with HMR
npm run build    # Type-check + production build
npm run preview  # Preview production build
npm run lint     # ESLint
```
