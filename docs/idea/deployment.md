# Deployment

> established by the developerz.ai maintainer agent for the maintainers of this repository from what onboarding read and ran in this repo, then owned by
> its maintainers. Correct it in place; setup never overwrites a page that exists.

`package.json` publishes compiled library files and CLI entry points, with `prepublishOnly` invoking the build. `.github/workflows/release.yml` runs on published GitHub releases, installs dependencies, lints, tests and builds before `npm publish --provenance --access public`. Publishing uses npm trusted publishing via OIDC, Node 22 and upgraded npm, not a repository token. `CLAUDE.md` specifies version bumps in `package.json` only.
