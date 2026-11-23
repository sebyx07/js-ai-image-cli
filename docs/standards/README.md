# Standards

> established by the developerz.ai maintainer agent for the maintainers of this repository from what onboarding read and ran in this repo, then owned by
> its maintainers. Correct it in place; setup never overwrites a page that exists.

| Rule | Enforcement |
|---|---|
| Keep two-space formatting, 120-column width and organized imports | `bun run lint`, `biome.json` |
| Keep source strict and generate typed library declarations | `bun run build`, `tsconfig.json` |
| Mock API traffic and cover errors, retry behavior and polling | `bun run test`, `tests/client.test.ts` |
| Keep CLI parsing/output separate from client transport | Review against `CLAUDE.md`, `src/bin/cli.ts`, `src/helpers.ts`, `src/client.ts` |
| Use typed library errors; never exit the process from library code | Review against `CLAUDE.md` and `src/errors.ts` |
| Avoid library `any` and type new public method returns | Review; `biome.json` disables noExplicitAny |
| Restore environment variables and globals in isolated tests | `bun run test` plus review; current config tests violate portable environment deletion semantics |

Observed gate blocker: `tests/config.test.ts` assigns undefined instead of removing an environment variable. On Bun 1.4.4 the suite reports 62 pass and 2 fail. Lint and build pass independently. Do not treat this as a missing credential or suppress these tests. `.github/workflows/ci.yml` runs install, lint, tests and build.
