# Brief: monthly improvement

Fired on the first Monday of the month (UTC days 1-7, `weeks_of_month: [1]`) by `schedules: improve`
in `.dz/maintainer/maintainer.yml`.

ai-media-cli is a public npm package (a CLI and a TypeScript library over the Kubeez API)
maintained by agents, with outside contributors. Once a month, leave it measurably better for the
people who run `npx ai-media-cli` or import `AIImageClient`. Read `CLAUDE.md` first: its rules
(typed errors and no `process.exit()` in library code, typed return values, retries on 5xx and 429
only, the version read from `package.json`, tests that mock `globalThis.fetch`) bind every change.
`bun run lint && bun test && bun run build` must be green before any pull request.

## Rows

- `community-pr-waiting`: a contributor's pull request or issue has waited more than 7 days on the maintainer (§1).
- `main-red`: `main` is red or flaky, or a health-brief row nobody fixed (§2 item 1).
- `api-drift`: the Kubeez API has an endpoint, parameter or response field the client lacks or still names wrongly (§2 item 2).
- `untested-method`: a public `AIImageClient` method or a CLI command without the tests `CLAUDE.md` requires (§2 item 3).
- `dep-major`: a dependency or action major Dependabot proposed and could not land, or does not propose (§2 item 4).
- `docs-drift`: a command, flag, model name, count or export in `README.md`, `CLAUDE.md`, `CONTRIBUTING.md` or `docs/**` no longer matches the code (§2 item 5).
- `dead-code`: an unused export, type, helper or dependency (§2 item 6).

## 1. People first

```bash
R=sebyx07/js-ai-image-cli
gh pr list -R $R --state open --json number,title,author,isDraft,createdAt,updatedAt,reviewDecision,statusCheckRollup,mergeable
gh issue list -R $R --state open --json number,title,author,createdAt,updatedAt,labels,comments
```

A contributor's ready pull request that is green and reviewed should already be merged: if one is
open, find out why (a first-time contributor's CI run waiting for approval, a conflict, an
unanswered question) and say so in the answer. A pull request that is red on something its author
cannot fix from a fork is yours: push the fix to their branch when the fork allows maintainer
edits, or open a follow-up that carries their commits with authorship kept, and thank them by
handle. Never close a contributor's pull request to re-do it under the bot's name.

## 2. Pick at most three improvements, in this order

1. A red or flaky `main`, or a health-brief row (`.dz/schedules/health.md`) nobody fixed.
2. API drift. Compare the client with the published spec, which needs no key:

   ```bash
   mkdir -p tmp   # gitignored
   curl -fsS https://api.kubeez.com/openapi.json -o tmp/openapi.json
   jq -r '.paths | keys[]' tmp/openapi.json
   grep -oE '/v1/[a-z/-]+' src/client.ts | sort -u
   ```

   A path the client calls that the spec dropped is a bug. A request or response shape in
   `src/types.ts` that disagrees with the spec is a bug. A new endpoint is a candidate only when it
   fits the package (media, music, speech): one typed client method, one command file, the tests,
   and the docs row, in one pull request.
3. Test gaps: every public `AIImageClient` method has a success test and an error test in
   `tests/client.test.ts`, and a retry test when it is retry-eligible; every file in
   `src/commands/` has a test in `tests/commands.test.ts`.
4. Dependency majors (commander, biome, typescript) and action majors: each one alone on its
   branch, reading the upstream migration guide. Minors and patches are Dependabot's. `engines.node`
   moves only when the floor it names has left maintenance, and that is a breaking change (§3).
5. Docs drift: every command and flag in `README.md` and `docs/CLI_REFERENCE.md` exists in
   `bun run dev -- --help` and each subcommand's `--help`; every export in `docs/LIBRARY_USAGE.md`
   exists in `src/index.ts`; the test count and model counts the README states are the real ones;
   every command in `CLAUDE.md` and `CONTRIBUTING.md` still runs.
6. Simplification: an export nothing imports, a type nothing uses, a helper with one caller, an
   unused dependency (`bunx knip`).

## 3. Ship

One pull request per improvement, small and reviewable, titled with what it changes. The body
gives the evidence: the spec excerpt, the failing test before the fix, the upstream release URL.
User-visible changes get a `CHANGELOG.md` entry. Never bump the version and never publish here:
a release is a published GitHub release, and that is the owner's call. A breaking change (a
removed or renamed command, flag, export or type, a changed default, a raised Node floor)
escalates to the owner instead of merging.

Never call a generation endpoint to test a change: `/v1/generate/*` spends credits. Tests mock
`globalThis.fetch`.

A change under `.github/` never shares a pull request with code. Open it on its own and say in the
body that it changes CI. Never edit `.dz/maintainer/` here.

If nothing is worth changing this month, do nothing: no empty PRs, no churn.
