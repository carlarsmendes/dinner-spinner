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
- Shareable weekly menu image export with native share fallback
- Social sharing metadata for WhatsApp, iMessage, Slack, X, and similar apps
- Gentle notices when there are not enough meals to fill the week
- First-run starter meals so the app is usable immediately
- Responsive warm visual design for mobile and desktop

## Project Structure

- `src/App.tsx` -> app state, navigation, meal CRUD wiring, screen layout
- `src/lib/generator.ts` -> weekly plan generation and kid-friendly logic
- `src/lib/shareMenu.ts` -> weekly menu image export and share fallbacks
- `src/lib/storage.ts` -> `localStorage` load/save helpers
- `src/components/` -> reusable UI pieces
- `src/constants.ts` -> starter data, labels, and week slot template
- `src/types.ts` -> core app types
- `public/og-image.svg` -> placeholder social preview asset

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

## Social Preview Image

- The app metadata currently points to `public/og-image.svg` as a placeholder social preview image.
- Replace it later with a final branded asset at `public/og-image.png` or update the metadata in `index.html` to your final file.
- If your production URL is not `https://dinner-spinner.vercel.app/`, update the canonical, Open Graph, and Twitter URLs in `index.html`.

## Share Flow

- `Share menu` exports a dedicated weekly menu card as an image using `html-to-image`.
- On supported mobile browsers, the app tries native file sharing first.
- If native file sharing is unavailable, the app downloads the menu image and copies a text version of the menu when clipboard access is available.

## Next MVP+ Improvements

- Add simple meal filtering on `My Meals` by type or tag
- Add lightweight notes for each generated week
- Support exporting or saving favorite generated plans
- Add a small “last cooked” signal to reduce repeats later
