# Meridian

A country explorer built around a 3D globe. On desktop you spin the globe, click a country, and open a detail page with facts, news, popular movies and an exchange rate. Underneath the globe is a searchable grid of every country. Phones get the same grid and a photo ticker, without the globe.

Repo: https://github.com/AdamPandey/countries-explorer

## Stack

- React 19 and Vite 7, plain JavaScript (JSX), React Router 7
- three.js through React Three Fiber and drei for the globe
- `world-atlas` (110m country outlines) with `topojson-client`, and `earcut` to triangulate the polygons
- Tailwind CSS 3 (PostCSS) and shadcn/ui components (Radix), Framer Motion for animation, `next-themes` is listed but the theme switch is a custom `ThemeProvider`
- Axios for requests
- Cloudflare Pages Functions in `functions/` as small API proxies

External APIs: REST Countries, TMDB, GNews, ExchangeRate-API, Pexels.

## Features

- Home page loads all countries once from REST Countries and shows them as cards (name, region, capital, population, flag) with skeleton cards while loading.
- Search in the navbar filters the grid by country name as you type. While a search is active the globe and photo ticker are hidden.
- Globe (screens 768px and wider): drag to rotate, scroll to zoom, it auto-rotates until you touch it. Hovering highlights a country, clicking one flies the camera to it and opens an info card with the flag, capital and population. "Show Details" goes to the detail page. Antarctica is ignored.
- Photo ticker: five columns of Pexels photos scrolling in opposite directions, one photo per random country, pausing on hover.
- Detail page at `/country/:countryCode` (the three-letter code): flag, official name, population, region, sub region, capital, currencies, languages, border country links, the current rate of the country's first currency against USD, up to 4 recent news articles and up to 8 popular movies from that country. News, movies and rate are fetched in parallel and each is optional, so one failing API does not blank the page.
- Dark and light theme, dark by default, saved in `localStorage` under `vite-ui-theme`.
- Navbar title moves from center to left on scroll, and the search icon expands into an input.

## Getting started

```bash
git clone https://github.com/AdamPandey/countries-explorer.git
cd countries-explorer
npm install
npm run dev
```

Vite serves on http://localhost:5173. Other scripts: `npm run build`, `npm run preview`, `npm run lint`. There are no tests.

No environment variables are read anywhere in the code. Keys are written directly into source files (see below).

`npm run dev` only runs Vite. The two proxy functions are not served by it, so locally the news section stays empty and the photo ticker does not appear. To run them you need Cloudflare's Pages runtime (for example `wrangler pages dev`), which is not a dependency of this project.

## Project structure

```
src/
  main.jsx                  router (/ and /country/:countryCode), theme provider
  App.jsx                   home page: fetch countries, search, globe, ticker, grid
  routes/CountryDetail.jsx  detail page and its API calls
  routes/Root.jsx           layout wrapper
  custom-components/        Navbar, CountryCard, skeleton, HeroTicker, TickerColumn, ScrollPrompt, ModeToggle, Logo
  custom-components/globe/  Globe (canvas, camera, selection), Country (one mesh per country), InfoCard
  components/ui/            shadcn/ui primitives, theme-provider
  hooks/useMediaQuery.js
functions/
  gnews.js                  GET /gnews?q=&lang=&max=
  pexels.js                 GET /pexels?query=
```

Alias `@` points to `src`.

## How it works

Home: `App.jsx` calls `https://restcountries.com/v3.1/all` with a `fields` filter (name, capital, population, flags, region, cca3, cca2). That one array feeds the grid, the globe and the ticker.

Globe: `Globe.jsx` turns the `world-atlas` TopoJSON into GeoJSON features. `Country.jsx` projects each polygon onto a sphere, triangulates it with `earcut` and renders it as a mesh with an outline. The atlas has no codes that match REST Countries, so a click is matched to a country by name (`name.common` or `name.official`). The camera moves toward the clicked country each frame until it reaches the target.

Detail: `CountryDetail.jsx` fetches `restcountries.com/v3.1/alpha/{code}`, then calls TMDB (`discover/movie` filtered by origin country, sorted by popularity), the `/gnews` function, and ExchangeRate-API with `Promise.allSettled`.

Proxies: browsers could not call GNews and Pexels directly (the git history mentions a CORS error), so `functions/gnews.js` and `functions/pexels.js` forward the request server-side and return the JSON with an open CORS header. They use the `onRequest(context)` signature of Cloudflare Pages Functions, and the commit history mentions deploying to Cloudflare Pages. The repo has no deploy config (no `wrangler.toml`, no `_redirects`), and no live URL is recorded anywhere in it.

## API keys

All four keys are committed in plain text: GNews and Pexels in `functions/`, TMDB and ExchangeRate-API in `src/routes/CountryDetail.jsx`. Earlier GNews keys are in the git history, and `HeroTicker.jsx` has an old Pexels key in a comment. The TMDB and ExchangeRate keys are shipped to every visitor's browser. If you fork this, use your own keys, and the existing ones should be revoked and replaced with environment variables or Cloudflare secrets. The commit log already shows two keys getting "burnt".

## Known gaps

- The photo ticker makes 25 Pexels requests on every home page load and renders only if all 25 return a photo.
- The detail page assumes every country has currencies and languages. A territory without them (Antarctica, for example) fails with "Could not load data for this country."
- Border countries show as three-letter codes, not names.
- Search matches the common name only. There is no region filter or sorting.
- The globe only recognises countries whose name matches between the two datasets, so some will not respond to clicks.
- On mobile there is no globe, by design.
- Unused leftovers: `InfoCard3D.jsx` (the info card was moved from 3D to an HTML overlay), `CountryGrid.jsx`, `src/App.css`, and the `@react-spring/three` dependency that only `InfoCard3D` uses. The `tailwind:init` script is also unused.
- The `functions/` proxies have no error handling, and the Pexels one fetches the first result only.

Thanks to @MohammedChe for collaborating on the project.
