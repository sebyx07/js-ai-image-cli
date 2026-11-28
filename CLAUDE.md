# Project brain

Every agent run on this repository loads this file as its project brain.

## Rules

- Keep each file single-purpose. Separate API transport from CLI output.
- Never call `process.exit()` in library code (`src/client.ts`, `src/errors.ts`, `src/types.ts`); throw typed errors. Only CLI commands may exit.
- Use `ConfigError` for config, `APIError` for HTTP and `TimeoutError` for polling timeouts; never use generic `Error`.
- Give every public `AIImageClient` method a typed return value; never add `Promise<unknown>`.
- Retry only 5xx and 429 responses; do not retry other 4xx errors.
- Read the version from `package.json` at runtime; never hardcode it.
- Keep library code free of `any`; `Record<string, any>` is allowed only in CLI action callbacks.

## Stack and API

| Item | Choice |
| --- | --- |
| Package | `ai-media-cli`, CLI and TypeScript library for image, video, music and speech generation |
| Runtime and tools | Node >= 18, Bun, TypeScript, Commander, Biome |
| API | Kubeez, `https://api.kubeez.com`, `X-API-Key` authentication; [API reference](https://api.kubeez.com/docs) |

## Commands

Run from the repository root.

| Command | Purpose |
| --- | --- |
| `./bin/setup` | Install dependencies from a fresh clone (Bun pinned in `.bun-version`, which CI reads too) |
| `bun test tests/<file>.test.ts` | Run one test file (the inner loop) |
| `bun test` | Run tests |
| `bun run lint` | Check `src/` and `tests/` with Biome; run before committing |
| `bun run lint:fix` | Apply Biome fixes |
| `bun run build` | Typecheck and emit `dist/` with TypeScript |
| `bun run dev -- ...` | Run the CLI in development |
| `./bin/dev` | Run the development CLI |
| `./bin/check` | The gate CI runs: lint, tests, then typecheck and build (`bun run build`). Run before every push |

## Structure

| Path | Responsibility |
| --- | --- |
| `src/client.ts` | `AIImageClient` HTTP methods, retries and polling |
| `src/config.ts` | Config I/O at `~/.ai-image-cli/config.json` and API key resolution |
| `src/errors.ts` | Typed errors |
| `src/types.ts` | Request and response interfaces, the source of truth for shapes |
| `src/helpers.ts` | CLI utilities: `createClient`, `formatJson`, `formatTable`, `printResult` |
| `src/commands/*.ts` | One file per CLI command; export one `register*Command(program)` function |
| `src/bin/cli.ts` | Commander setup and command registration only |
| `src/index.ts` | Library re-exports from client, errors and types only |

## Tests and style

- Use `bun:test` with `describe`, `it`, `expect` and `mock`; name files `tests/<module>.test.ts`.
- Mock `globalThis.fetch` in client tests; never call the real API. Save and restore environment variables and globals in `beforeEach` and `afterEach`.
- For each new API method, test success and error; also test retries where eligible.
- For CLI commands, mock `createClient()` and capture console output.
- Use Biome formatting, alphabetically sorted imports, 2-space indentation and a 120-character line width.

## Release

- Bump the version in `package.json` only; the client and CLI read it at runtime.
- Push to main and create a GitHub release to publish to npm through OIDC trusted publishing.
- Publish with `npm publish --provenance --access public`; CI requires npm >= 11.5.1.
