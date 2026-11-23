# AI-first scorecard

> This card is the repository's own — established by the developerz.ai maintainer agent for the maintainers of this repository; each onboarding run rewrites the file whole, the latest run wins, and the same card is stored on the platform.

- Run: `run_9db397390b874ce6aed614ecf822fa08`
- Computed: 2026-11-23T23:22:14.177Z
- Proof: **unprovable** — `bin/check` did not run green at head on this box. Nothing in the repository’s own code was changed to force it; the excerpt below is the record.
- Score: 11 of 15 items ok

## `policy` — ok

- .dz/maintainer/maintainer.yml established
- .dz/maintainer/reviewer.md established, still the unfilled template

## `brain` — ok

- CLAUDE.md already present, left alone

## `roster` — ok

- .claude/agents/cli-commands.md established
- .claude/agents/kubeez-api.md established

## `skills` — ok

- .claude/skills/verify-change/SKILL.md established

## `scripts` — ok

- bin/setup established
- bin/dev established
- bin/check established
- bin/stop established
- down: ./bin/stop (bin)
- ./bin/setup exited 0 at head (0.1s)

## `wiring` — ok

- .mcp.json established

## `commands` — ok

- .claude/commands/planx.md established
- .claude/commands/feature.md established
- .claude/commands/bug-sweep.md established

## `access` — gap

- landed 0 of 2 asked
- still missing: AI_IMAGE_API_KEY, AI_IMAGE_API_URL

## `layout` — gap

- migration to the house layout filed as tasks
- apps/js-ai-image-cli: 7 move(s) planned as one task

## `smoke_test` — unprovable

- tests/client.test.ts in the repository
- ./bin/check at head: red, exit 1 (3.2s)

## `env_example` — ok

- .env.example already present, left alone

## `agents_md` — ok

- AGENTS.md established

## `per_workspace_brains` — ok

- single-package repository: 0 workspaces
- CLAUDE.md already present, left alone

## `docs_readme` — ok

- docs/README.md established

## `gate_proved` — unprovable

- ./bin/check at head: red, exit 1 (3.2s)
