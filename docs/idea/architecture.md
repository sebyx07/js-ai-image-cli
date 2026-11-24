# Architecture

> established by the developerz.ai maintainer agent for the maintainers of this repository from what onboarding read and ran in this repo, then owned by
> its maintainers. Correct it in place; setup never overwrites a page that exists.

`src/bin/cli.ts` registers Commander handlers from `src/commands/`. Commands use `src/helpers.ts` for client construction and formatting, and `src/config.ts` for authentication persistence. `src/client.ts` centralizes HTTP transport, retries and polling. `src/types.ts` defines API shapes; `src/errors.ts` defines typed failures. `src/index.ts` exposes the library without CLI wiring. Keep API logic independent of terminal output.
