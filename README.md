# Blogius Frontend

Angular 21 frontend for the Blogius blog platform. Provides a full CRUD interface for blog posts, communicating with the [Blogius backend](https://github.com/kresko/blogius-backend) (Spring Boot, port 8080).

## Features

- **Post listing** — responsive card grid showing all posts with title, author, excerpt, and date
- **Post detail** — full post view with edit and delete actions
- **Create / edit posts** — shared form with validation (title, author, content)
- **Delete posts** — confirmation dialog before deletion
- **SSR** — server-side rendering via `@angular/ssr` + Express 5
- **Zoneless change detection** — uses Angular signals; no `zone.js`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components) |
| Rendering | SSR (`@angular/ssr`) |
| HTTP | Angular `HttpClient` + RxJS |
| Reactivity | Angular signals (zoneless) |
| Testing | Vitest |
| Backend | Spring Boot REST API on `localhost:8080` |

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | — | Redirects to `/posts` |
| `/posts` | `PostListComponent` | All posts |
| `/posts/new` | `PostFormComponent` | Create a post |
| `/posts/:id` | `PostDetailComponent` | View a post |
| `/posts/:id/edit` | `PostFormComponent` | Edit a post |

## Project Structure

```
src/app/
├── components/
│   ├── post-list/       # card grid of all posts
│   ├── post-detail/     # single post view
│   └── post-form/       # create & edit form
├── models/
│   └── post.model.ts    # Post interface
├── services/
│   └── post.service.ts  # CRUD calls to /api/posts
├── app.ts               # root component
├── app.routes.ts        # route definitions
└── app.config.ts        # app-level providers
```

## Prerequisites

- Node.js 18+
- [Blogius backend](https://github.com/kresko/blogius-backend) running on `http://localhost:8080`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server (proxies `/api` to the backend automatically):

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Available Scripts

```bash
npm start          # development server on :4200
npm run build      # production build → dist/
npm test           # unit tests with Vitest
npm run watch      # build in watch mode (development)
```

### SSR production server

```bash
npm run build
npm run serve:ssr:blogius-frontend
```

## Backend Proxy

The dev server proxies all `/api/*` requests to `http://localhost:8080` (configured in `proxy.conf.json`), so no CORS setup is needed during development.

## Docs

`docs/blogius-frontend-setup-guide.md` — step-by-step guide to building this project from scratch.
