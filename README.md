<p align="center">
  <img src="https://media.kubeez.com/images/ba8e6fb6-3310-4eda-bc0b-d301910d05bf.png" alt="ai-image-cli — generate AI images, videos, music and speech from your terminal" width="100%" />
</p>

<h1 align="center">ai-image-cli</h1>

<p align="center">
  The easiest way to generate AI images, videos, music, and speech from JavaScript / TypeScript.<br/>
  Use it as a <strong>CLI</strong>, via <strong>npx</strong>, or as a <strong>library</strong> in your own projects.
</p>

<p align="center">
  Powered by <a href="https://kubeez.com">Kubeez</a> — a simple, powerful API for AI media generation.
</p>

<p align="center">
  <a href="https://github.com/sebyx07/js-ai-image-cli/actions/workflows/ci.yml"><img src="https://github.com/sebyx07/js-ai-image-cli/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/ai-image-cli"><img src="https://img.shields.io/npm/v/ai-image-cli.svg" alt="npm" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

---

## Why ai-image-cli?

- One package for **images, videos, music, and speech** generation
- Works as a **CLI tool**, **npx command**, and **TypeScript / JavaScript library**
- Simple `ai-image login` — no config files to create
- Built-in `--wait` flag to poll until generation completes
- Automatic **retry with backoff** on server errors and rate limits
- **Custom error classes** — `APIError`, `TimeoutError` for clean error handling
- **Table output** for models with pricing — or `--json` for scripting
- Fully typed with TypeScript, 46 tests
- Supports 40+ AI models from top providers (OpenAI, Google, Black Forest Labs, ByteDance, xAI, and more)

---

## Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Authentication](#authentication)
- [CLI Commands](#cli-commands)
- [Library Usage](#library-usage)
- [Available Models & Pricing](#available-models--pricing)
- [Examples](#examples)
- [Development](#development)
- [API Documentation](#api-documentation)
- [License](#license)

---

## Quick Start

```bash
# No install needed — just use npx
npx ai-image-cli login YOUR_API_KEY
npx ai-image-cli generate -p "a cyberpunk cityscape at sunset" -m nano-banana-2 --wait
```

Get your API key at [kubeez.com](https://kubeez.com) -> [API Keys](https://dev.kubeez.com/settings/api-keys).

---

## Installation

### Global Install (recommended for CLI)

```bash
npm install -g ai-image-cli
# or
bun install -g ai-image-cli
```

Then use anywhere:

```bash
ai-image generate -p "a beautiful mountain landscape" -m nano-banana-2 --wait
```

### As a Library

```bash
npm install ai-image-cli
# or
bun add ai-image-cli
```

```typescript
import { AIImageClient } from "ai-image-cli";

const client = new AIImageClient({ apiKey: "your-key" });

const gen = await client.generateMedia({
  prompt: "a serene Japanese garden in autumn",
  model: "nano-banana-2",
});

const result = await client.pollForCompletion(gen.generation_id);
console.log(result.outputs?.[0]?.url);
```

---

## Authentication

### Option 1: Login command (recommended)

```bash
ai-image login YOUR_API_KEY
```

Saves to `~/.ai-image-cli/config.json` with `600` permissions. One-time setup.

```bash
ai-image whoami     # show masked key + balance
ai-image logout     # remove saved key
```

### Option 2: Environment variable

```bash
export AI_IMAGE_API_KEY=your_api_key_here
```

Environment variable always takes priority over the config file.

---

## CLI Commands

### Authentication

| Command | Description |
|---------|-------------|
| `ai-image login <key>` | Save API key to ~/.ai-image-cli |
| `ai-image logout` | Remove saved key |
| `ai-image whoami` | Show masked key and balance |

### Generation

```bash
# List models with pricing table
ai-image models
ai-image models --type image
ai-image models --type video --json

# Generate images
ai-image generate -p "a cute robot painting" -m nano-banana-2 --wait
ai-image generate -p "cinematic landscape" -m nano-banana-2 -a 16:9 --wait
ai-image generate -p "portrait" -m nano-banana-2 -n "blurry, low quality" --wait

# Generate video
ai-image generate -p "ocean waves" -m kling-v2 --type text-to-video --duration 5 --sound --wait

# Image-to-video
ai-image generate -p "camera zoom" -m kling-v2 --type image-to-video --source-urls URL --wait

# Image-to-image
ai-image generate -p "watercolor style" -m 5-lite-image-to-image --type image-to-image --source-urls URL --wait

# Music
ai-image music -p "lo-fi hip hop beat" --instrumental --wait
ai-image music -p "epic orchestral soundtrack" -m V5 --wait

# Text-to-speech
ai-image dialogue -d '[{"text":"Hello!","voice":"Adam"},{"text":"Hi!","voice":"Emily"}]'

# Ad copy
ai-image ad-copy -r https://example.com/ad.png --product-text "Premium headphones" --variants 3
```

### Utilities

```bash
ai-image upload -f ./photo.jpg                    # Upload media
ai-image status -i GENERATION_ID --wait           # Check/poll status
ai-image balance                                  # Check credits
ai-image generations --status completed           # List generations
```

All `generate` options:

| Flag | Description | Default |
|------|-------------|---------|
| `-p, --prompt` | Generation prompt **(required)** | — |
| `-m, --model` | Model **(required)** | — |
| `-t, --type` | `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video` | `text-to-image` |
| `-n, --negative-prompt` | What to avoid | `""` |
| `-a, --aspect-ratio` | `1:1`, `16:9`, `9:16`, etc. | `1:1` |
| `-d, --duration` | Video duration (seconds) | — |
| `-q, --quality` | Quality level | — |
| `-s, --seed` | Reproducibility seed | `0` |
| `--sound` | Enable audio on video | `false` |
| `--fixed-lens` | Fixed camera lens | `false` |
| `--source-urls` | Source media URLs | — |
| `-w, --wait` | Poll until done | `false` |

> Full CLI reference: [docs/CLI_REFERENCE.md](docs/CLI_REFERENCE.md)

---

## Library Usage

### Basic Setup

```typescript
import { AIImageClient } from "ai-image-cli";

const client = new AIImageClient({
  apiKey: process.env.AI_IMAGE_API_KEY!,
});
```

### Generate an Image

```typescript
const gen = await client.generateMedia({
  prompt: "a futuristic city with flying cars",
  model: "nano-banana-2",
  aspect_ratio: "16:9",
  negative_prompt: "blurry, watermark",
});

const result = await client.pollForCompletion(gen.generation_id);
console.log("Image URL:", result.outputs?.[0]?.url);
```

### Generate Video

```typescript
const video = await client.generateMedia({
  prompt: "timelapse of clouds over mountains",
  model: "kling-v2",
  generation_type: "text-to-video",
  duration: "5",
  sound: true,
});

const result = await client.pollForCompletion(video.generation_id);
```

### Generate Music

```typescript
const music = await client.generateMusic({
  prompt: "energetic rock anthem",
  instrumental: false,
  model: "V5",
});

const result = await client.pollForCompletion(music.generation_id, "music");
```

### Text-to-Speech

```typescript
const speech = await client.generateDialogue({
  dialogue: [
    { text: "Welcome to our podcast!", voice: "Adam" },
    { text: "Thanks for having me!", voice: "Emily" },
  ],
  stability: 0.7,
  language_code: "en",
});
```

### Error Handling

```typescript
import { AIImageClient, APIError, TimeoutError } from "ai-image-cli";

try {
  await client.generateMedia({ prompt: "test", model: "bad" });
} catch (error) {
  if (error instanceof APIError) {
    console.error(`HTTP ${error.statusCode}: ${error.message}`);
    if (error.isRateLimited) console.error("Slow down!");
    if (error.isUnauthorized) console.error("Check your API key");
  }
  if (error instanceof TimeoutError) {
    console.error(`Timed out after ${error.attempts} polls`);
  }
}
```

### All Exports

```typescript
import { AIImageClient, APIError, ConfigError, TimeoutError } from "ai-image-cli";
import type {
  ClientOptions,
  GenerateMediaRequest,
  GenerateMusicRequest,
  GenerateDialogueRequest,
  GenerateAdCopyRequest,
  GenerateResponse,
  DialogueLine,
  GenerationStatus,
  GenerationOutput,
  BalanceResponse,
  UploadResponse,
  GenerationsListParams,
  ModelsResponse,
  Model,
} from "ai-image-cli";
```

> Full library guide: [docs/LIBRARY_USAGE.md](docs/LIBRARY_USAGE.md)

---

## Available Models & Pricing

Kubeez uses a **credit-based** system. Each model has a different cost per generation.

### Highlighted Models

| Model | Type | Provider | ~Credits | Features |
|-------|------|----------|----------|----------|
| `nano-banana-2` | Image | Kubeez | 14 | Fast, good quality |
| `nano-banana-pro` | Image | Kubeez | 20 | Higher quality |
| `imagen-4-fast` | Image | Google | 7 | Fast Google Imagen |
| `imagen-4` | Image | Google | 13 | High quality |
| `gpt-1.5-image-high` | Image | OpenAI | 50 | GPT Image |
| `5-lite-text-to-image` | Image | ByteDance | 12 | Seedream, img-to-img support |
| `flux-2-1K` | Image | Black Forest Labs | varies | FLUX model |
| `kling-v2` | Video | Kuaishou | varies | Text/image to video, sound |
| `veo-2` | Video | Google | varies | Text to video |
| `V5` | Music | Suno | varies | Vocals + instrumental |

### Plans

| Plan | Best For | Savings |
|------|----------|---------|
| Free Trial | Testing (free credits on signup) | — |
| Starter | Light experimentation | 4% vs. PAYG |
| Pro | Full experience (most popular) | ~20% vs. PAYG |
| Powerhouse | High-volume production | ~44% vs. PAYG |

Yearly billing saves an additional ~16%. See [kubeez.com/pricing](https://kubeez.com/pricing).

```bash
# Check real-time model pricing
ai-image models

# Check your balance
ai-image balance
```

> Full models list: [docs/MODELS.md](docs/MODELS.md)

---

## Examples

### Batch generate with different seeds

```bash
for i in 1 2 3 4 5; do
  ai-image generate -p "abstract art variation $i" -m nano-banana-2 --seed $i --wait
done
```

### Upload and transform

```bash
URL=$(ai-image upload -f photo.jpg | jq -r '.url')
ai-image generate -p "anime style" -m 5-lite-image-to-image --type image-to-image --source-urls "$URL" --wait
```

### Express API

```typescript
import express from "express";
import { AIImageClient } from "ai-image-cli";

const app = express();
const client = new AIImageClient({ apiKey: process.env.AI_IMAGE_API_KEY! });

app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { prompt, model = "nano-banana-2" } = req.body;
  const gen = await client.generateMedia({ prompt, model });
  const result = await client.pollForCompletion(gen.generation_id);
  res.json(result);
});

app.listen(3000);
```

### Node.js script

```typescript
import { AIImageClient } from "ai-image-cli";

const client = new AIImageClient({ apiKey: process.env.AI_IMAGE_API_KEY! });

const gen = await client.generateMedia({
  prompt: "tech company banner, gradient purple to blue, minimalist",
  model: "nano-banana-2",
  aspect_ratio: "16:9",
});

const result = await client.pollForCompletion(gen.generation_id);
if (result.status === "completed") {
  console.log("Ready:", result.outputs?.[0]?.url);
}
```

---

## Development

```bash
git clone https://github.com/sebyx07/js-ai-image-cli.git
cd js-ai-image-cli
bun install

bun run dev -- --help          # Run CLI
bun test                       # 46 tests
bun run lint                   # Biome linting
bun run build                  # TypeScript build
```

---

## API Documentation

- [Kubeez API Docs](https://api.kubeez.com/docs) — full OpenAPI spec
- [API Keys](https://dev.kubeez.com/settings/api-keys) — manage your keys
- [Pricing](https://kubeez.com/pricing) — plans and credit packages

---

## License

[MIT](LICENSE)
