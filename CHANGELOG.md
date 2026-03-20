# Changelog

## 2.1.0

- **Fix:** `getApiKey()` now throws `ConfigError` instead of calling `process.exit(1)` — safe for library usage
- **Fix:** `generate` command no longer sends empty string for `duration` or `seed: 0` when not specified
- **Fix:** `uploadMedia` now uses async file reading instead of blocking `readFileSync`
- **Fix:** Documentation referenced wrong config directory (`~/.ai-media-cli` instead of `~/.ai-image-cli`)
- **Add:** `--wait` flag for `dialogue` and `ad-copy` commands
- **Add:** `whoami` command — show masked API key and account balance
- **Add:** `--json` flag on `models` and `balance` for scripting
- **Add:** Table output for `models` command (model, provider, cost, estimated time)
- **Add:** Custom headers support via `ClientOptions.headers`
- **Add:** Default `User-Agent` and `X-Client` headers on all requests
- **Add:** Automatic retry with exponential backoff on 5xx and 429 errors
- **Add:** Custom error classes: `APIError`, `TimeoutError`, `ConfigError`
- **Add:** Typed `GenerateResponse`, `GenerationOutput`, `ModelsResponse`, `GenerationsListResponse`
- **Add:** `exports` field in package.json for modern module resolution
- **Add:** 64 tests covering client, errors, config, helpers, and CLI commands
- **Add:** OIDC trusted publisher for automated npm releases

## 2.0.0

- Initial release
- CLI with 11 commands: login, logout, whoami, models, generate, music, dialogue, ad-copy, upload, status, balance, generations
- TypeScript library with `AIImageClient`
- `--wait` polling for generate and music commands
- Config file support at `~/.ai-image-cli/config.json`
