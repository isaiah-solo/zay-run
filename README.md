# zay-run

My personal website.

## Stack

- [Astro 7](https://astro.build) — static output, islands architecture
- [React 19](https://react.dev) + TypeScript (strict) for interactive islands
- [Tailwind CSS 4](https://tailwindcss.com) via `@tailwindcss/vite`
- [Biome](https://biomejs.dev) for linting + formatting
- [pnpm](https://pnpm.io)

## Commands

| Command        | Action                                    |
| -------------- | ----------------------------------------- |
| `pnpm install` | Install dependencies                      |
| `pnpm dev`     | Dev server at `localhost:4321`            |
| `pnpm build`   | Production build to `./dist/`             |
| `pnpm preview` | Preview the production build locally      |
| `pnpm check`   | Type-check (`astro check`) + lint (Biome) |
| `pnpm lint`    | Lint only                                 |
| `pnpm format`  | Format all files                          |

## Structure

```
src/
├── components/   React islands (.tsx) — hydrate with client:* directives
├── layouts/      Shared page shells (.astro)
├── pages/        File-based routes (.astro)
└── styles/       global.css (Tailwind entry)
public/           Static assets served as-is
```
