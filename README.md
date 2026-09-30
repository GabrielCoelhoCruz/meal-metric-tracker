# Meal Metric Tracker

A mobile-first meal and nutrition tracker. Follow a diet plan meal by meal, swap foods by equivalent portions, and track streaks and weekly progress.

## Features

- **Daily meal plan** with per-item check-off and quantity edits
- **Food exchanges and substitutions** from a built-in food list
- **History and analytics:** filters, stats cards, weekly chart, streaks
- **Offline-first:** local storage with background sync to Supabase
- **PWA and native builds:** installable web app, Android and iOS through Capacitor
- **Reminders** through browser notifications

## Stack

React · TypeScript · Vite · Tailwind CSS · shadcn/ui · TanStack Query · Supabase · Capacitor

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |
