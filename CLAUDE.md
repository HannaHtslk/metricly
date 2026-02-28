# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript check + production build (tsc -b && vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

There is no test suite configured.

## Architecture

**Metricly** is a React + TypeScript analytics dashboard with Firebase authentication.

### Tech Stack
- **React 19** + **React Router 7** (BrowserRouter, SPA routing)
- **Redux Toolkit** + **RTK Query** for state and data fetching
- **Material-UI 7** with Emotion for styling; light/dark theme toggle
- **Firebase 12** for Google OAuth + email/password auth
- **Recharts** for charts
- **Vite + SWC** for bundling; deployed to Vercel (`vercel.json` rewrites all paths to `/`)

### Data Flow

Firebase `onAuthStateChanged` is observed in `App.tsx`'s `AuthListener` component, which dispatches `setUser` to the Redux `authSlice`. The `useAuth` hook reads `{ user, loading }` from the store. RTK Query (`src/api/usersApi.ts`) hits `https://dummyjson.com/` for mock user/product data (100 records each).

### Routing

```
/           → LandingPage (public)
/login      → LoginPage (redirects to /dashboard if already authenticated)
/dashboard  → DashboardPage  ┐
/users      → UsersPage      ├─ wrapped by ProtectedRoute (redirects to /login if unauth'd)
/analytics  → AnalyticsPage  ┘
```

`ProtectedRoute` shows a loading spinner while auth initializes, then redirects unauthenticated users.

### Key File Locations

| Concern | Path |
|---|---|
| Firebase init + auth functions | `src/firebase/firebase.ts` |
| Redux store + types | `src/store/index.ts` |
| Auth slice (setUser, setLoading) | `src/store/authSlice.ts` |
| RTK Query API (users, products) | `src/api/usersApi.ts` |
| Auth state hook | `src/hooks/useAuth.ts` |
| Theme (light/dark) | `src/theme/theme.ts` |
| App routing + auth listener | `src/App.tsx` |
| Layout (Navbar + Outlet) | `src/components/layout/AppLayout.tsx` |
| Route guard | `src/components/layout/ProtectedRoute.tsx` |

### Environment Variables

Firebase credentials are read via `import.meta.env.VITE_FIREBASE_*`. All required variables are set in `.env`.

### TypeScript

Strict mode is on (`strict`, `noUnusedLocals`, `noUnusedParameters`). Target is ES2022. Module resolution is `bundler` (Vite-compatible).

### Project Status

Authentication, routing, Redux, RTK Query, theme system, and Navbar are implemented. Most page and component files under `src/pages/` and `src/components/` are scaffolded but not yet implemented.
