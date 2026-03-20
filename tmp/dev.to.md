---
title: "How to Generate AI Images, Videos, Music & Speech Programmatically with JavaScript"
published: false
description: "Learn how to programmatically generate AI images, videos, music, and text-to-speech in JavaScript and TypeScript. One SDK for 40+ models — like OpenRouter but for AI media generation."
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

The [`ai-media-cli`](https://www.npmjs.com/package/ai-media-cli) package is essentially an **OpenRouter for AI-generated media** — a single TypeScript SDK that routes to **40+ models** across providers like OpenAI, Google, Black Forest Labs, ByteDance, xAI, and Suno. One API key, one interface, one billing account. Swap models by changing a string, not rewriting your integration.

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

You have access to models across multiple providers:

| Model | Provider | Best For |
|-------|----------|----------|
| `nano-banana-2` | Kubeez | Fast, general purpose |
| `gpt-1.5-image-high` | OpenAI | High quality, prompt adherence |
| `imagen-4-standard` | Google | Photorealism |
| `flux-2-1k` | Black Forest Labs | Artistic, creative styles |
| `seedream-v4.5` | ByteDance | Detail-rich scenes |

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
  model: "kling-v2",
  generation_type: "text-to-video",
  duration: 5,
  aspect_ratio: "16:9",
  sound: true, // generate audio with the video
});

const result = await client.pollForCompletion(generation.generation_id);
console.log(result.outputs?.[0]?.url); // MP4 URL
```

### Image-to-Video

Turn a static image into a short video — great for product animations or social content:

```typescript
const generation = await client.generateMedia({
  prompt: "gentle camera zoom in with soft parallax motion",
  model: "kling-v2",
  generation_type: "image-to-video",
  source_urls: ["https://example.com/my-product-shot.jpg"],
  duration: 5,
});

const result = await client.pollForCompletion(generation.generation_id);
```

Available video models include **Kling v2**, **Google Veo 2**, and **Wan-X** — each with different strengths for motion quality, duration, and style.

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
ai-image generate -p "drone flyover mountain valley" -m kling-v2 -t text-to-video --wait

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
