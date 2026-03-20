---
title: "How to Generate AI Images, Videos, Music & Speech Programmatically with JavaScript"
published: false
description: "Learn how to programmatically generate AI images, videos, music, and text-to-speech in JavaScript and TypeScript. One SDK for 90+ models — like OpenRouter but for AI media generation."
tags: ai, javascript, typescript, webdev
cover_image: https://media.kubeez.com/images/d1157a44-1908-49c1-b018-b3e0649de192.png
# Use a ratio of 100:42 for best results.
# published_at: 2026-03-20 11:35 +0000
---

AI-generated media is everywhere — product images, marketing videos, background music, voiceovers. But if you've tried integrating it into a JavaScript project, you know the pain: each provider has its own SDK, its own auth flow, its own async patterns. You end up writing more glue code than actual product logic.

In this post, I'll walk through how to **programmatically generate images, videos, music, and speech** in JavaScript/TypeScript — with real code you can copy into your project today.

---

## The Problem with Multiple AI Media APIs

Let's say you want your app to generate a product image, a short promo video, and a background track. You'd need:

- An **OpenAI** or **Google** account for image generation
- A **Kling** or **Veo** account for video generation
- A **Suno** account for music generation
- Three different SDKs, three billing dashboards, three sets of API keys
- Custom polling logic for each (none of them return results synchronously)

That's a lot of overhead before you've written a single line of business logic.

---

## A Simpler Approach: One SDK, All Media Types

You know how [OpenRouter](https://openrouter.ai) gives you a single API to access hundreds of LLMs? The same concept exists for AI media generation.

The [`ai-media-cli`](https://www.npmjs.com/package/ai-media-cli) package is essentially an **OpenRouter for AI-generated media** — a single TypeScript SDK that routes to **90+ models** across providers like OpenAI, Google, Black Forest Labs, ByteDance, xAI, and Suno. One API key, one interface, one billing account. Swap models by changing a string, not rewriting your integration.

```bash
npm install ai-media-cli
```

```typescript
import { AIImageClient } from "ai-media-cli";

const client = new AIImageClient({
  apiKey: process.env.AI_IMAGE_API_KEY,
});
```

That's your setup. One client, one API key. Let's generate some media.

---

## Generating AI Images in JavaScript

### Text-to-Image

```typescript
const generation = await client.generateMedia({
  prompt: "a product photo of wireless headphones on a marble surface, soft studio lighting",
  model: "nano-banana-2",
  aspect_ratio: "1:1",
});

// Poll until the image is ready
const result = await client.pollForCompletion(generation.generation_id);
const imageUrl = result.outputs?.[0]?.url;
console.log(imageUrl); // https://media.kubeez.com/images/...
```

The `pollForCompletion` method handles the async nature of AI generation — it checks status every few seconds and resolves when the image is ready. No webhooks, no manual polling loops.

### Image-to-Image

Already have an image and want to transform it? Upload it first, then reference it:

```typescript
const upload = await client.uploadMedia("./reference-photo.jpg");

const generation = await client.generateMedia({
  prompt: "transform into an oil painting style, rich warm colors",
  model: "nano-banana-2",
  generation_type: "image-to-image",
  source_urls: [upload.url],
});

const result = await client.pollForCompletion(generation.generation_id);
```

### Choosing a Model

Here are some popular image models to get started:

| Model ID | Provider | Credits | Best For |
|----------|----------|---------|----------|
| `nano-banana-2` | Google | 14 | Fast, general purpose |
| `gpt-1.5-image-high` | OpenAI | 32 | High quality, prompt adherence |
| `imagen-4` | Google | 13 | Photorealism |
| `imagen-4-fast` | Google | 7 | Quick drafts, lowest cost |
| `flux-2-1K` | Black Forest Labs | 10 | Artistic, creative styles |
| `seedream-v4-5` | ByteDance | 9 | Detail-rich scenes |
| `Z-image` | Alibaba | 3 | Ultra-cheap generations |

You can list all available models programmatically:

```typescript
const models = await client.listModels();
models.forEach((m) => console.log(m.name, m.credits_cost));
```

---

## Generating AI Videos in JavaScript

### Text-to-Video

```typescript
const generation = await client.generateMedia({
  prompt: "a slow-motion shot of ocean waves crashing on rocks at sunset",
  model: "kling-2-6-text-to-video-5s-audio",
  generation_type: "text-to-video",
  aspect_ratio: "16:9",
});

const result = await client.pollForCompletion(generation.generation_id);
console.log(result.outputs?.[0]?.url); // MP4 URL
```

### Image-to-Video

Turn a static image into a short video — great for product animations or social content:

```typescript
const generation = await client.generateMedia({
  prompt: "gentle camera zoom in with soft parallax motion",
  model: "kling-2-6-image-to-video-5s",
  generation_type: "image-to-video",
  source_urls: ["https://example.com/my-product-shot.jpg"],
});

const result = await client.pollForCompletion(generation.generation_id);
```

Available video models include **Kling 2.6/3.0** (Kuaishou), **Seedance 1.5** (ByteDance), **Veo 3.1** (Google), **Grok** (xAI), and **Wan 2.5** (Alibaba) — each with different strengths for motion quality, duration, resolution, and style.

---

## Generating AI Music in JavaScript

Need a background track for a video, podcast intro, or game?

```typescript
const generation = await client.generateMusic({
  prompt: "upbeat lo-fi hip hop, vinyl crackle, mellow piano chords, rainy day vibes",
  model: "V5",
  instrumental: true,
});

const result = await client.pollForCompletion(generation.generation_id, "music");
console.log(result.outputs?.[0]?.url); // Audio file URL
```

Set `instrumental: false` if you want AI-generated vocals. The `V5` model (powered by Suno) produces full-length tracks with surprisingly good musical structure.

---

## Generating AI Speech in JavaScript

For voiceovers, narration, or dialogue — you can generate multi-speaker audio:

```typescript
const generation = await client.generateDialogue({
  dialogue: [
    { text: "Welcome back to the show. Today we're talking about AI in production.", voice: "Adam" },
    { text: "Thanks for having me. Let's dive right in.", voice: "Emily" },
    { text: "So what's the biggest challenge teams face when shipping AI features?", voice: "Adam" },
    { text: "Honestly? It's the integration complexity. The AI part is the easy part.", voice: "Emily" },
  ],
  stability: 0.7,
  language_code: "en",
});
```

This is particularly useful for generating podcast-style content, app onboarding audio, or dynamic narration.

---

## Practical Example: Automated Social Media Content Pipeline

Here's a real-world use case — a script that generates a complete social media post with image, caption-ready metadata, and background music:

```typescript
import { AIImageClient } from "ai-media-cli";

const client = new AIImageClient({ apiKey: process.env.AI_IMAGE_API_KEY });

async function generateSocialContent(topic: string) {
  // Generate visual and audio in parallel
  const [imageGen, musicGen] = await Promise.all([
    client.generateMedia({
      prompt: `social media post visual for: ${topic}, modern design, bold colors, 4K`,
      model: "nano-banana-2",
      aspect_ratio: "1:1",
    }),
    client.generateMusic({
      prompt: `short upbeat jingle for social media, 15 seconds, ${topic} vibes`,
      model: "V5",
      instrumental: true,
    }),
  ]);

  // Wait for both to complete in parallel
  const [image, music] = await Promise.all([
    client.pollForCompletion(imageGen.generation_id),
    client.pollForCompletion(musicGen.generation_id, "music"),
  ]);

  return {
    imageUrl: image.outputs?.[0]?.url,
    musicUrl: music.outputs?.[0]?.url,
  };
}

const content = await generateSocialContent("spring product launch");
console.log(content);
```

Since image and music generation are independent, we fire them off in parallel with `Promise.all` — cutting total wait time roughly in half.

---

## Writing Better Prompts for Complex Images

The quality of your output depends heavily on your prompt. Here are patterns that produce significantly better results:

### Be specific about composition, lighting, and style

```typescript
// Vague — unpredictable results
await client.generateMedia({
  prompt: "a cat",
  model: "nano-banana-2",
});

// Specific — consistent, high-quality output
await client.generateMedia({
  prompt: "a tabby cat sitting on a windowsill, golden hour sunlight streaming through sheer curtains, shallow depth of field, shot on 85mm lens, warm color palette, photorealistic",
  model: "nano-banana-2",
  aspect_ratio: "16:9",
});
```

### Use negative prompts to remove unwanted elements

```typescript
await client.generateMedia({
  prompt: "professional headshot of a business executive, studio lighting, neutral gray background, sharp focus, 4K",
  negative_prompt: "blurry, distorted face, extra fingers, low quality, cartoon, illustration, watermark, text",
  model: "nano-banana-2",
});
```

### Layer details: subject, environment, mood, technical

A good prompt formula: **[subject] + [setting/environment] + [mood/atmosphere] + [technical/style details]**

```typescript
// Product photography
await client.generateMedia({
  prompt: "minimalist flat lay of a leather watch on a slate surface, single stem of eucalyptus, soft diffused overhead lighting, muted earth tones, editorial product photography, 8K detail",
  model: "gpt-1.5-image-high",
  aspect_ratio: "1:1",
});

// Architectural visualization
await client.generateMedia({
  prompt: "modern Japanese tea house with floor-to-ceiling glass walls, surrounded by a moss garden and maple trees in autumn, morning fog, architectural photography by Hiroshi Sugimoto, ultra wide angle, natural light",
  model: "imagen-4-ultra",
  aspect_ratio: "16:9",
});

// Fantasy / creative
await client.generateMedia({
  prompt: "an ancient library carved inside a giant redwood tree, bioluminescent mushrooms providing soft blue-green light, leather-bound books on spiral shelves, tiny fireflies, magical realism, painted by Studio Ghibli, intricate detail",
  model: "flux-2-2K",
  aspect_ratio: "9:16",
});

// UI/UX mockup
await client.generateMedia({
  prompt: "clean mobile app interface for a meditation app, dark mode, glassmorphism cards, subtle gradient backgrounds in deep purple and navy, minimal icons, SF Pro Display font, Dribbble quality, UI design",
  model: "nano-banana-2",
  aspect_ratio: "9:16",
});
```

### Match the model to the task

- **Photorealism**: `imagen-4`, `gpt-1.5-image-high`, `seedream-v4-5`
- **Creative/artistic**: `flux-2-2K`, `nano-banana-pro`
- **Quick iterations**: `imagen-4-fast`, `Z-image`, `nano-banana`
- **High resolution**: `nano-banana-2-4K`, `nano-banana-pro-4K`, `flux-2-2K`
- **Image editing**: `flux-2-edit-1K`, `seedream-v4-5-edit`, `nano-banana-edit`

---

## Using It from the Command Line

If you just need a quick generation without writing code, the package also works as a CLI:

```bash
# Install globally
npm install -g ai-media-cli

# One-time auth
ai-image login YOUR_API_KEY

# Generate an image
ai-image generate -p "product flat lay, minimal, white background" -m nano-banana-2 --wait

# Generate a video
ai-image generate -p "drone flyover mountain valley" -m kling-2-6-text-to-video-5s-audio -t text-to-video --wait

# Generate music
ai-image music -p "ambient electronic, space theme" -m V5 --wait

# Or use npx without installing
npx ai-media-cli generate -p "..." -m nano-banana-2 --wait
```

Great for prototyping prompts before coding them into your app.

---

## CI/CD Integration

You can automate media generation in your pipelines. Here's a GitHub Actions example:

```yaml
- name: Generate marketing assets
  env:
    AI_IMAGE_API_KEY: ${{ secrets.AI_IMAGE_API_KEY }}
  run: |
    npx ai-media-cli generate \
      -p "hero banner for product launch, abstract gradient, modern" \
      -m nano-banana-2 \
      -a 16:9 \
      --wait
```

---

## Error Handling

The library provides typed errors for clean handling in production:

```typescript
import { AIImageClient, APIError, TimeoutError, ConfigError } from "ai-media-cli";

try {
  const result = await client.generateMedia({ prompt: "...", model: "nano-banana-2" });
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof TimeoutError) {
    console.error("Generation timed out — try a simpler prompt or different model");
  } else if (error instanceof ConfigError) {
    console.error("Missing API key — set AI_IMAGE_API_KEY or call client with { apiKey }");
  }
}
```

Built-in retry logic handles transient failures and rate limits automatically with exponential backoff — you don't need to add your own.

---

## All 91 Available Models

Here's the full list of models you can access through the SDK, organized by type:

### Image Models (27)

| Model ID | Name | Provider | Credits |
|----------|------|----------|---------|
| `nano-banana` | Nano Banana | Google | 7 |
| `nano-banana-2` | Nano Banana 2 | Google | 14 |
| `nano-banana-2-2K` | Nano Banana 2 2K | Google | 17 |
| `nano-banana-2-4K` | Nano Banana 2 4K | Google | 25 |
| `nano-banana-edit` | Nano Banana Edit | Google | 7 |
| `nano-banana-pro` | Nano Banana Pro | Google | 31 |
| `nano-banana-pro-2K` | Nano Banana Pro 2K | Google | 31 |
| `nano-banana-pro-4K` | Nano Banana Pro 4K | Google | 41 |
| `imagen-4-fast` | Imagen 4 Fast | Google | 7 |
| `imagen-4` | Imagen 4 | Google | 13 |
| `imagen-4-ultra` | Imagen 4 Ultra | Google | 19 |
| `gpt-1.5-image-medium` | GPT 1.5 Image Medium | OpenAI | 10 |
| `gpt-1.5-image-high` | GPT 1.5 Image High | OpenAI | 32 |
| `flux-2-1K` | Flux 2 1K | Black Forest Labs | 10 |
| `flux-2-2K` | Flux 2 2K | Black Forest Labs | 13 |
| `flux-2-edit-1K` | Flux 2 Edit 1K | Black Forest Labs | 10 |
| `flux-2-edit-2K` | Flux 2 Edit 2K | Black Forest Labs | 13 |
| `grok-text-to-image` | Grok Text-to-Image | xAI | 14 |
| `seedream-v4` | Seedream V4 | ByteDance | 7 |
| `seedream-v4-5` | Seedream 4.5 | ByteDance | 9 |
| `seedream-v4-edit` | Seedream V4 Edit | ByteDance | 7 |
| `seedream-v4-5-edit` | Seedream V4.5 Edit | ByteDance | 9 |
| `5-lite-text-to-image` | Seedream 5 Lite | ByteDance | 12 |
| `5-lite-image-to-image` | Seedream 5 Lite I2I | ByteDance | 12 |
| `Z-image` | Z-image | Alibaba | 3 |
| `replicate-z-image-hd` | Z-Image HD | Alibaba | 6 |
| `ad-copy` | Ad Copy | Kubeez | 50 |

### Video Models (53)

| Model ID | Name | Provider | Credits |
|----------|------|----------|---------|
| `kling-2-5-image-to-video-pro` | Kling 2.5 I2V Pro | Kuaishou | 65 |
| `kling-2-5-image-to-video-pro-10s` | Kling 2.5 I2V Pro 10s | Kuaishou | 125 |
| `kling-2-6-text-to-video-5s` | Kling 2.6 (5s) | Kuaishou | 90 |
| `kling-2-6-text-to-video-5s-audio` | Kling 2.6 (5s, audio) | Kuaishou | 175 |
| `kling-2-6-text-to-video-10s` | Kling 2.6 (10s) | Kuaishou | 175 |
| `kling-2-6-text-to-video-10s-audio` | Kling 2.6 (10s, audio) | Kuaishou | 310 |
| `kling-2-6-image-to-video-5s` | Kling 2.6 I2V (5s) | Kuaishou | 90 |
| `kling-2-6-image-to-video-5s-audio` | Kling 2.6 I2V (5s, audio) | Kuaishou | 175 |
| `kling-2-6-image-to-video-10s` | Kling 2.6 I2V (10s) | Kuaishou | 175 |
| `kling-2-6-image-to-video-10s-audio` | Kling 2.6 I2V (10s, audio) | Kuaishou | 310 |
| `kling-2-6-motion-control-720p` | Kling 2.6 Motion | Kuaishou | 270 |
| `kling-2-6-motion-control-1080p` | Kling 2.6 Motion Pro | Kuaishou | 360 |
| `kling-3-0-std` | Kling 3.0 | Kuaishou | 105 |
| `kling-3-0-pro` | Kling 3.0 Pro | Kuaishou | 125 |
| `kling-3-0-motion-control-720p` | Kling 3.0 Motion | Kuaishou | 720 |
| `kling-3-0-motion-control-1080p` | Kling 3.0 Motion Pro | Kuaishou | 960 |
| `seedance-1-5-pro-480p-4s` | Seedance 1.5 (480p, 4s) | ByteDance | 12 |
| `seedance-1-5-pro-480p-8s` | Seedance 1.5 (480p, 8s) | ByteDance | 24 |
| `seedance-1-5-pro-480p-12s` | Seedance 1.5 (480p, 12s) | ByteDance | 48 |
| `seedance-1-5-pro-720p-4s` | Seedance 1.5 (720p, 4s) | ByteDance | 19 |
| `seedance-1-5-pro-720p-8s` | Seedance 1.5 (720p, 8s) | ByteDance | 38 |
| `seedance-1-5-pro-720p-12s` | Seedance 1.5 (720p, 12s) | ByteDance | 76 |
| `seedance-1-5-pro-1080p-4s` | Seedance 1.5 (1080p, 4s) | ByteDance | 39 |
| `seedance-1-5-pro-1080p-8s` | Seedance 1.5 (1080p, 8s) | ByteDance | 78 |
| `seedance-1-5-pro-1080p-12s` | Seedance 1.5 (1080p, 12s) | ByteDance | 156 |
| `seedance-1-5-pro-480p-4s-audio` | Seedance 1.5 (480p, 4s, audio) | ByteDance | 24 |
| `seedance-1-5-pro-480p-8s-audio` | Seedance 1.5 (480p, 8s, audio) | ByteDance | 48 |
| `seedance-1-5-pro-480p-12s-audio` | Seedance 1.5 (480p, 12s, audio) | ByteDance | 58 |
| `seedance-1-5-pro-720p-4s-audio` | Seedance 1.5 (720p, 4s, audio) | ByteDance | 38 |
| `seedance-1-5-pro-720p-8s-audio` | Seedance 1.5 (720p, 8s, audio) | ByteDance | 76 |
| `seedance-1-5-pro-720p-12s-audio` | Seedance 1.5 (720p, 12s, audio) | ByteDance | 152 |
| `seedance-1-5-pro-1080p-4s-audio` | Seedance 1.5 (1080p, 4s, audio) | ByteDance | 78 |
| `seedance-1-5-pro-1080p-8s-audio` | Seedance 1.5 (1080p, 8s, audio) | ByteDance | 156 |
| `seedance-1-5-pro-1080p-12s-audio` | Seedance 1.5 (1080p, 12s, audio) | ByteDance | 312 |
| `v1-pro-fast-i2v-720p-5s` | Seedance 1.0 (720p, 5s) | ByteDance | 40 |
| `v1-pro-fast-i2v-720p-10s` | Seedance 1.0 (720p, 10s) | ByteDance | 80 |
| `v1-pro-fast-i2v-1080p-5s` | Seedance 1.0 (1080p, 5s) | ByteDance | 80 |
| `v1-pro-fast-i2v-1080p-10s` | Seedance 1.0 (1080p, 10s) | ByteDance | 130 |
| `veo3-1-fast-text-to-video` | Veo 3.1 Fast T2V | Google | 99 |
| `veo3-1-fast-reference-to-video` | Veo 3.1 Fast Ref2V | Google | 99 |
| `veo3-1-fast-first-and-last-frames` | Veo 3.1 Fast F&L | Google | 99 |
| `veo3-1-text-to-video` | Veo 3.1 Quality T2V | Google | 390 |
| `veo3-1-first-and-last-frames` | Veo 3.1 Quality F&L | Google | 390 |
| `grok-text-to-video-6s` | Grok T2V (6s) | xAI | 65 |
| `grok-image-to-video` | Grok I2V | xAI | 65 |
| `wan-2-5` | Wan 2.5 | Alibaba | 155 |
| `wan-2-5-text-to-video-5s-720p` | Wan 2.5 T2V (5s, 720p) | Alibaba | 93 |
| `wan-2-5-text-to-video-5s-1080p` | Wan 2.5 T2V (5s, 1080p) | Alibaba | 155 |
| `wan-2-5-text-to-video-10s-720p` | Wan 2.5 T2V (10s, 720p) | Alibaba | 186 |
| `wan-2-5-text-to-video-10s-1080p` | Wan 2.5 T2V (10s, 1080p) | Alibaba | 310 |
| `wan-2-5-image-to-video-5s-720p` | Wan 2.5 I2V (5s, 720p) | Alibaba | 93 |
| `wan-2-5-image-to-video-5s-1080p` | Wan 2.5 I2V (5s, 1080p) | Alibaba | 155 |
| `wan-2-5-image-to-video-10s-1080p` | Wan 2.5 I2V (10s, 1080p) | Alibaba | 310 |

### Music Models (7)

| Model ID | Name | Provider | Credits |
|----------|------|----------|---------|
| `V4` | Music V4 | Suno | 19 |
| `V4_5` | Music V4.5 | Suno | 19 |
| `V4_5PLUS` | Music V4.5+ | Suno | 19 |
| `V5` | Music V5 | Suno | 19 |
| `suno-add-vocals` | Add Vocals | Suno | 19 |
| `suno-add-instrumental` | Add Instrumental | Suno | 19 |
| `suno-lyrics-generation` | Lyrics Generation | Suno | 2 |

### Speech, Separation & Other (4)

| Model ID | Name | Provider | Credits |
|----------|------|----------|---------|
| `text-to-dialogue-v3` | Text To Dialogue V3 | ElevenLabs | 21 |
| `mvsep-40` | Vocal/Instrumental Separation | MVSEP | 6 |
| `auto-caption` | Auto Caption | Kubeez | 0.5 |

---

## Getting Started

1. Grab a free API key at [kubeez.com](https://kubeez.com) (comes with trial credits)
2. Install the package:

```bash
npm install ai-media-cli
```

3. Start generating:

```typescript
import { AIImageClient } from "ai-media-cli";
const client = new AIImageClient({ apiKey: "your-key" });
```

- **npm**: [npmjs.com/package/ai-media-cli](https://www.npmjs.com/package/ai-media-cli)
- **GitHub**: [github.com/sebyx07/js-ai-image-cli](https://github.com/sebyx07/js-ai-image-cli)

---

The barrier to generating AI media programmatically has dropped significantly. What used to require stitching together multiple provider SDKs is now a few lines of JavaScript. If you're building anything that touches images, video, audio, or voice — give it a try and let me know what you build.
