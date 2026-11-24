# Stack

> established by the developerz.ai maintainer agent for the maintainers of this repository from what onboarding read and ran in this repo, then owned by
> its maintainers. Correct it in place; setup never overwrites a page that exists.

`package.json` and `bun.lock` define Bun development tooling, TypeScript, Biome and Commander. `tsconfig.json` compiles strict ES2022/CommonJS source with declarations and maps; tests are excluded from compilation. `biome.json` enables recommended linting, import organization, two-space formatting and a 120-column width. `tests/` uses Bun's built-in runner. CI uses latest Bun in `.github/workflows/ci.yml`.

Verified on Bun 1.4.4: `bun install`, `bun run dev -- --help`, lint and build succeeded. `bun run test` failed two config tests, with 62 passing. Assigning undefined to `process.env.AI_IMAGE_API_KEY` yields the string "undefined" in `tests/config.test.ts`. No clean full gate was established, so generated command-trio fields are empty. No database or system-package setup is present.
