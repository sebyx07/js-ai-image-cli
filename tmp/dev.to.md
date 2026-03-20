---
title: "Generate AI Images, Videos, Music & Speech from Your Terminal — One npm Package"
published: false
description: "Meet ai-media-cli: a single CLI tool and TypeScript library that generates images, videos, music, and speech using 40+ AI models from OpenAI, Google, Flux, Kling, Suno and more."
tags: ai, javascript, typescript, opensource
cover_image: https://media.kubeez.com/images/d1157a44-1908-49c1-b018-b3e0649de192.png
# Use a ratio of 100:42 for best results.
# published_at: 2026-03-20 11:35 +0000
---

# Generate AI Images, Videos, Music & Speech from Your Terminal — One npm Package

If you've ever wanted to generate AI media without juggling multiple APIs, SDKs, and billing dashboards — there's now a single npm package that handles it all.

**[ai-media-cli](https://www.npmjs.com/package/ai-media-cli)** is an open-source CLI tool and TypeScript/JavaScript library that lets you generate **images, videos, music, and text-to-speech audio** — all from one unified interface.

No more switching between providers. No more managing 5 different API keys. One install, one command.

---

## What Can It Do?

| Media Type | What You Get | Example Models |
|-----------|-------------|----------------|
| **Images** | Text-to-image, image-to-image | OpenAI GPT-Image, Google Imagen 4, FLUX-2, Seedream |
| **Videos** | Text-to-video, image-to-video | Kling v2, Google Veo 2, Wan-X |
| **Music** | Full tracks with vocals or instrumental | Suno V5 |
| **Speech** | Multi-speaker dialogue generation | Built-in TTS voices |

That's **40+ models** across the top AI providers, accessible through a single tool.

---

## Quick Start

### Install globally

```bash
npm install -g ai-media-cli
```

### Authenticate once

```bash
ai-image login YOUR_API_KEY
```

You can grab a free API key at [kubeez.com](https://kubeez.com) — it comes with free trial credits.

### Generate your first image

```bash
ai-image generate \
  -p "a cyberpunk cityscape at sunset, neon reflections on wet streets" \
  -m nano-banana-2 \
  -a 16:9 \
  --wait
```

The `--wait` flag polls automatically until the image is ready and gives you the download URL. No webhook setup needed.

### Generate a video

```bash
ai-image generate \
  -p "a drone flyover of a mountain valley at golden hour" \
  -m kling-v2 \
  -t text-to-video \
  -d 5 \
  --sound \
  --wait
```

### Generate music

```bash
ai-image music \
  -p "upbeat lo-fi hip hop beat, rainy day vibes" \
  -m V5 \
  --wait
```

### Generate speech

```bash
ai-image dialogue \
  --dialogue '[{"text":"Welcome to the show!","voice":"Adam"},{"text":"Thanks for having me.","voice":"Emily"}]' \
  --wait
```

---

## Use It as a Library Too

`ai-media-cli` isn't just a CLI — it's a fully-typed TypeScript library you can drop into any Node.js project.

```bash
npm install ai-media-cli
```

```typescript
import { AIImageClient } from "ai-media-cli";

const client = new AIImageClient({ apiKey: process.env.AI_IMAGE_API_KEY });

// Generate an image
const gen = await client.generateMedia({
  prompt: "a serene Japanese garden in watercolor style",
  model: "nano-banana-2",
  aspect_ratio: "16:9",
});

// Wait for completion
const result = await client.pollForCompletion(gen.generation_id);
console.log(result.outputs?.[0]?.url);
```

```typescript
// Generate music
const music = await client.generateMusic({
  prompt: "epic cinematic orchestral trailer music",
  instrumental: true,
  model: "V5",
});

const track = await client.pollForCompletion(music.generation_id, "music");
console.log(track.outputs?.[0]?.url);
```

```typescript
// Multi-speaker dialogue
const speech = await client.generateDialogue({
  dialogue: [
    { text: "The future of AI is multimodal.", voice: "Adam" },
    { text: "Absolutely. And it should be accessible to every developer.", voice: "Emily" },
  ],
  stability: 0.7,
  language_code: "en",
});
```

Full TypeScript definitions are included — you get autocompletion and type safety out of the box.

---

## Useful CLI Commands

Beyond generation, the CLI comes with everything you need to manage your workflow:

```bash
# List all available models with pricing
ai-image models

# Check your credit balance
ai-image balance

# Check the status of a generation
ai-image status <generation_id>

# List your generation history
ai-image generations

# Upload a source image for image-to-image or image-to-video
ai-image upload ./my-photo.jpg
```

Use `--json` on any command for machine-readable output — great for scripting and CI/CD pipelines.

---

## Why Not Just Use the Provider APIs Directly?

You absolutely can. But here's what you get with a unified approach:

- **One API key** instead of managing credentials for OpenAI, Google, Black Forest Labs, ByteDance, etc.
- **One consistent interface** — same CLI flags and library methods regardless of the underlying model
- **Built-in retry logic** with exponential backoff for rate limits and server errors
- **Automatic polling** so you don't have to build your own status-checking loops
- **Model discovery** — run `ai-image models` and see what's available with pricing, instead of reading 6 different docs sites
- **Credit-based billing** — pay for what you use across all providers through a single account

---

## Built for Developers

A few things that make this developer-friendly:

- **Works with npx** — no install needed for one-off use: `npx ai-media-cli generate -p "..." -m nano-banana-2 --wait`
- **Environment variable support** — set `AI_IMAGE_API_KEY` and skip the login step entirely
- **Custom error classes** — `APIError`, `TimeoutError`, `ConfigError` for clean error handling
- **MIT licensed** — use it however you want
- **Node.js 18+** compatible

---

## Example: Generate a Blog Cover Image from Your CI

```yaml
# .github/workflows/generate-cover.yml
- name: Generate cover image
  env:
    AI_IMAGE_API_KEY: ${{ secrets.AI_IMAGE_API_KEY }}
  run: |
    npx ai-media-cli generate \
      -p "minimalist tech blog header, abstract gradient" \
      -m nano-banana-2 \
      -a 16:9 \
      --wait \
      --json > cover.json
```

---

## Get Started

```bash
npm install -g ai-media-cli
```

- **npm**: [npmjs.com/package/ai-media-cli](https://www.npmjs.com/package/ai-media-cli)
- **GitHub**: [github.com/sebyx07/js-ai-image-cli](https://github.com/sebyx07/js-ai-image-cli)
- **API Keys & Docs**: [kubeez.com](https://kubeez.com)

---

If you build something cool with it, I'd love to see it — drop a comment or open an issue on GitHub!
