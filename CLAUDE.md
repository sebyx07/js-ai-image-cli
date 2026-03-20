# CLAUDE.md

## Project

ai-media-cli — npm package for AI media generation (images, videos, music, speech). CLI tool + TypeScript library wrapping the Kubeez API (https://api.kubeez.com/docs).

## Commands

```bash
bun install          # install deps
bun test             # run 64 tests
bun run lint         # biome check
bun run lint:fix     # biome auto-fix
bun run build        # tsc → dist/
bun run dev -- ...   # run CLI in dev mode
```

## Architecture

Single-responsibility structure:
- `src/client.ts` — `AIImageClient` HTTP client. Retry logic, polling, all API methods.
- `src/config.ts` — Config file I/O (`~/.ai-image-cli/config.json`), API key resolution.
- `src/errors.ts` — `APIError`, `ConfigError`, `TimeoutError`. Never use generic Error.
- `src/types.ts` — All TypeScript interfaces. One source of truth for request/response shapes.
- `src/helpers.ts` — CLI-only utilities (createClient, formatJson, formatTable, printResult).
- `src/commands/*.ts` — One file per CLI command. Each exports a single `register*Command(program)` function.
- `src/bin/cli.ts` — Entry point. Only wires commands to Commander, no logic.
- `src/index.ts` — Library exports. Only re-exports from client, errors, types.

## Code Rules

- SOLID / SRP: each file has one job. Don't mix API logic with CLI output.
- Never call `process.exit()` in library code (src/client.ts, src/errors.ts, src/types.ts). Throw typed errors instead. Only CLI commands may exit.
- All public `AIImageClient` methods must have typed return values. No `Promise<unknown>` on new methods.
- Use `ConfigError` for config issues, `APIError` for HTTP errors, `TimeoutError` for polling timeout.
- Retry only on 5xx and 429. Never retry 4xx client errors.
- Version comes from package.json at runtime — never hardcode version strings.

## Testing

- Framework: `bun:test` with `describe/it/expect/mock`
- Mock `globalThis.fetch` for client tests — never hit real API
- Tests must be self-contained: save/restore env vars and globals in beforeEach/afterEach
- Test file naming: `tests/<module>.test.ts`
- Every new API method needs: success test, error test. Retry-eligible methods need retry test.
- CLI command tests: mock `createClient()`, capture console output.

## Style

- Biome for lint + format. Run `bun run lint` before committing.
- Imports sorted alphabetically (biome enforces this).
- No `any` in library code. `Record<string, any>` is OK in CLI command action callbacks only.
- 2-space indent, 120 char line width.

## Release

- Bump version in package.json only (client.ts and cli.ts read it at runtime).
- Push to main, create GitHub release → auto-publishes to npm via OIDC trusted publisher.
- `npm publish --provenance --access public` (requires npm >= 11.5.1 in CI).

## API Reference

Base URL: `https://api.kubeez.com`. Auth: `X-API-Key` header. Full spec: https://api.kubeez.com/docs
