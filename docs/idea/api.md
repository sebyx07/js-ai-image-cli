# API

> established by the developerz.ai maintainer agent for the maintainers of this repository from what onboarding read and ran in this repo, then owned by
> its maintainers. Correct it in place; setup never overwrites a page that exists.

`src/client.ts` defaults to https://api.kubeez.com and sends `X-API-Key` authentication. It wraps models, media and music generation/status, dialogue, ad copy, upload, balance, generations and health endpoints. JSON bodies set application/json; uploads use FormData. HTTP 5xx, 429 and network failures receive exponential-backoff retries. Polling handles media or music, defaults to 3-second intervals and 200 attempts, returns terminal failure statuses and throws `TimeoutError` on exhaustion. Request and response contracts live in `src/types.ts`.
