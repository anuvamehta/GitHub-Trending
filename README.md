# GitHub Trending

A small Angular (v21) application that lists the **top 20 trending GitHub repositories** and lets you open any repository's details page. Built with standalone components, signals, TailwindCSS, and the GitHub REST API.

## Features

- **Dashboard** (`/dashboard`) - the 20 most-starred repositories from the GitHub search API.
- **Project details** (`/project/:owner/:repo`) - a deep-linkable page with stats and a link to GitHub.
- **Click-through navigation** - selecting a repository card routes to its details page.
- **Back navigation** - a back link and the browser back button both return to the dashboard.
- **Loading & error states** on both pages, plus a global HTTP error interceptor.

## Tech stack

- Angular 21 (standalone components, signals, new control flow)
- TailwindCSS 3
- RxJS (`shareReplay` caching in the service)
- Karma + Jasmine for tests
- pnpm

## Getting started

```bash
pnpm install
pnpm start          # dev server at http://localhost:4200
```

Other scripts:

```bash
pnpm build          # production build to dist/github-trending/browser
pnpm test           # interactive tests (Karma)
pnpm test:ci        # one-shot headless test run
```

## Architecture

```
src/app
├── core
│   ├── interceptors/error.interceptor.ts   # global HTTP error logging
│   ├── models/repository.model.ts          # Repository interface
│   └── services/github.service.ts          # GitHub API calls + shareReplay cache
├── features
│   ├── dashboard/                          # dashboard.component.ts + .html
│   └── project-details/                    # project-details.component.ts + .html
├── shared
│   └── repository-card/                    # reusable card component
├── app.component.ts                        # app shell (header + outlet)
├── app.config.ts                           # providers (HttpClient, router)
└── app.routes.ts                           # route table
```

### Notes

- The GitHub REST API has no dedicated trending endpoint, so the dashboard uses the search API: `GET /search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=20`.
- The service caches the trending list with `shareReplay(1)` so returning to the dashboard does not refetch.
- The details page reads `:owner`/`:repo` from the route and fetches `GET /repos/{owner}/{repo}`, keeping it deep-linkable.
- The browser back button works out of the box via the Angular Router.

## Testing

Tests use **Jasmine** (spec framework) run by **Karma** (test runner) - the Angular default. They rely on a simple mock `GithubService` (returning `of(...)` / `throwError(...)`) rather than HTTP/router test harnesses. Run them with `pnpm test:ci`.

Six specs run in headless Chrome; five validate key user interactions:

1. Dashboard renders a card per repository returned by the service.
2. Each card links to its project details route (`/project/:owner/:repo`).
3. The details page renders the repository returned by the service.
4. The details page has a back link to the dashboard.
5. The details page shows an error message when the request fails.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` tests, builds with the correct `--base-href`, adds a SPA `404.html` fallback for deep links, and publishes to GitHub Pages on every push to `main`.

To enable it:

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` - the site deploys to `https://<your-user>.github.io/<repo>/`.
```
