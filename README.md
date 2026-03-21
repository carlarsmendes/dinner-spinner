# Dinner Spinner

Dinner Spinner is a lightweight family meal-planning MVP built with React, Vite, and TypeScript. It stores your own meal ideas in `localStorage`, then turns them into a simple weekly plan with a playful, cozy UI.

## Stack

- React
- Vite
- TypeScript
- `localStorage` persistence
- Vercel-friendly static frontend

## Features

- `This Week` screen with weekly meal generation
- `My Meals` screen for adding, editing, and deleting meals
- Meal types: `main`, `soup`, `snack`
- Tags including `kid-friendly`
- Weekly generator for `3 mains + 1 soup + 1 snack`
- Regenerate flow that respects locked meal cards
- Gentle notices when there are not enough meals to fill the week
- First-run starter meals so the app is usable immediately
- Responsive warm visual design for mobile and desktop

## Project Structure

- `src/App.tsx` -> app state, navigation, meal CRUD wiring, screen layout
- `src/lib/generator.ts` -> weekly plan generation and kid-friendly logic
- `src/lib/storage.ts` -> `localStorage` load/save helpers
- `src/components/` -> reusable UI pieces
- `src/constants.ts` -> starter data, labels, and week slot template
- `src/types.ts` -> core app types

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Deploy To Vercel

This app is a standard Vite frontend. Vercel can deploy it with the default settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

## Next MVP+ Improvements

- Add simple meal filtering on `My Meals` by type or tag
- Add lightweight notes for each generated week
- Support exporting or saving favorite generated plans
- Add a small “last cooked” signal to reduce repeats later
