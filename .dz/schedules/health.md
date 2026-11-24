# Brief: is the project healthy?

Daily checkup, fired by `schedules: health` in `.dz/maintainer/maintainer.yml`. ai-media-cli is
maintained so that nobody has to watch it. This covers the failures no issue or PR announces.
Read-only: it reports failing rows, it never publishes, tags, pushes or calls a paid Kubeez
endpoint. A row whose only fix is under `.github/` or `.dz/` is stated in the run's answer instead
of filed: the monthly `improve` task (`.dz/schedules/improve.md`) or the owner picks it up.

```bash
R=sebyx07/js-ai-image-cli
PKG=ai-media-cli
v=$(gh api "repos/$R/contents/package.json" --jq .content | base64 -d | jq -r .version)
tag="v$v"
```

| Signal | Command | Healthy |
|---|---|---|
| `main` is green | `gh run list -R $R --workflow ci.yml --branch main --event push --limit 1 --json conclusion,headSha,url,createdAt` | `success` |
| the gate still passes today | on a fresh checkout of `main`: `bun install && bun run lint && bun test && bun run build` | every step exits 0. CI installs the latest Bun and `main` can go months without a push, so a green run from long ago proves nothing about today's toolchain |
| the last release published | `gh run list -R $R --workflow release.yml --limit 1 --json conclusion,displayTitle,url,createdAt` | `success`, or no run yet, or one in progress |
| npm serves the `package.json` version | `curl -s -o /dev/null -w '%{http_code}' "https://registry.npmjs.org/$PKG/$v"` | `200`; or `404` while a `release.yml` run for `$v` is in flight or under 2 h old. Any other code is a failed read, not a verdict |
| the release is tagged | `gh api "repos/$R/git/ref/tags/$tag" --jq .ref` and `gh release view "$tag" -R $R --json tagName` | both exist once npm serves `$v` |
| the published CLI starts | `npx --yes "$PKG@$v" --version` and `npx --yes "$PKG@$v" --help` | prints `$v`; the help lists the commands the README documents. Neither needs an API key |
| the Kubeez API still matches the client | `curl -fsS https://api.kubeez.com/openapi.json \| jq -r '.paths \| keys[]'` against `grep -oE '/v1/[a-z/-]+' src/client.ts \| sort -u` | every path `src/client.ts` calls is listed |
| Dependabot is not stuck | `gh pr list -R $R --author app/dependabot --state open --json number,title,createdAt,statusCheckRollup` | none open more than 7 days, none red more than 2 days |
| community pull requests are not waiting | `gh pr list -R $R --state open --json number,title,author,isDraft,createdAt,updatedAt,reviewDecision,statusCheckRollup` | no non-draft pull request from a person has gone more than 3 days without a review or an answer from the maintainer |
| docs links resolve | every relative `](…)` link in `README.md`, `CLAUDE.md`, `CONTRIBUTING.md` and `docs/**` points to a file that exists | no dead links |

If a workflow named above does not exist (`gh workflow view <file> -R $R` fails), that is the row,
not an error in this brief. A command that cannot run (no network, `gh` unauthenticated) is a
failed read: say `not read`, never a verdict.

## Rows

Each failing row is filed once, with the exact title below, unless an open issue with that title
(or the same title prefix for rows with a variable) already exists:
`gh issue list -R $R --state open --search '"<title>" in:title'`. The body carries the command, its
output and the run URL. A red `main` comes first: nothing releases from it.

- `main-red`: title `main is red at <short sha>`. The last push run of `ci.yml` on `main` did not conclude `success`.
- `gate-rotted`: title `the gate fails on a fresh checkout of main`. `main`'s last CI run is green but lint, tests or the build fail today. Name the failing step and the Bun version (`bun --version`).
- `release-unpublished`: title `release v<version> did not publish`. The last `release.yml` run did not conclude `success`.
- `npm-version-lag`: title `npm does not serve <version>`. npm answers 404 for `$v` and no release run is in flight or under 2 h old.
- `release-untagged`: title `<tag> is published but not tagged`. npm serves `$v` but the `$tag` tag or GitHub release is missing.
- `cli-broken`: title `ai-media-cli@<version> does not start`. `npx` fails, or `--version` prints something other than `$v`. Add the full output: this is what every new user runs first.
- `kubeez-api-drift`: title `Kubeez dropped <path>`. The Kubeez OpenAPI no longer lists a path `src/client.ts` calls. One issue per path.
- `dependabot-stuck`: title `Dependabot PR #<n> is stuck`. A Dependabot PR open more than 7 days, or red more than 2 days. Say why (red check, conflict, waiting on review).
- `community-pr-waiting`: title `PR #<n> from @<author> is waiting on the maintainer`. A contributor's ready pull request has had no review and no answer for more than 3 days. Say what it waits on.
- `dead-doc-link`: title `dead link in <file>`. A relative link points at a file that does not exist.

Never delete a tag, re-run a publish, `npm publish` or push to `main` from here. Never call a
generation endpoint: `/v1/generate/*` spends credits. The OpenAPI document needs no key.
