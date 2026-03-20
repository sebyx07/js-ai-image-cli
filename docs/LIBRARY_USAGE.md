# Library Usage Guide

Use `ai-image-cli` as a dependency in your Node.js, Bun, or TypeScript projects.

## Installation

```bash
npm install ai-image-cli
# or
bun add ai-image-cli
```

## Creating a Client

```typescript
import { AIImageClient } from "ai-image-cli";

const client = new AIImageClient({
  apiKey: process.env.AI_IMAGE_API_KEY!,
  baseUrl: "https://api.kubeez.com", // optional, this is the default
});
```

## Image Generation

```typescript
const result = await client.generateMedia({
  prompt: "a futuristic city with flying cars",
  model: "nano-banana-2",
  aspect_ratio: "16:9",
  negative_prompt: "blurry, watermark",
});

console.log("Generation ID:", result.generation_id);

// Wait for completion
const completed = await client.pollForCompletion(result.generation_id);
console.log("Image URL:", completed.outputs?.[0]?.url);
```

## Video Generation

```typescript
const video = await client.generateMedia({
  prompt: "a timelapse of clouds moving over mountains",
  model: "kling-v2",
  generation_type: "text-to-video",
  duration: "5",
  sound: true,
});

const result = await client.pollForCompletion(video.generation_id);
```

## Image-to-Video

```typescript
const upload = await client.uploadMedia("./my-photo.jpg");

const video = await client.generateMedia({
  prompt: "gentle camera zoom with parallax effect",
  model: "kling-v2",
  generation_type: "image-to-video",
  source_media_urls: [upload.url],
});

const result = await client.pollForCompletion(video.generation_id);
```

## Music Generation

```typescript
const music = await client.generateMusic({
  prompt: "energetic rock anthem with electric guitars",
  instrumental: false,
  model: "V5",
});

const result = await client.pollForCompletion(music.generation_id, "music");
```

## Text-to-Speech (Dialogue)

```typescript
const speech = await client.generateDialogue({
  dialogue: [
    { text: "Welcome to our show!", voice: "Adam" },
    { text: "Great to be here.", voice: "Emily" },
  ],
  stability: 0.7,
  language_code: "en",
});
```

## Ad Copy Generation

```typescript
const adCopy = await client.generateAdCopy({
  reference_ad_url: "https://example.com/reference-ad.png",
  product_text: "Premium wireless headphones",
  language: "en",
  variant_count: 3,
  aspect_ratio: "9:16",
});
```

## List Models

```typescript
const all = await client.getModels();
const imageModels = await client.getModels("image");
const videoModels = await client.getModels("video");
```

## Check Balance

```typescript
const balance = await client.getBalance();
console.log(`Credits: ${balance.credits}`);
```

## List Generations

```typescript
const completed = await client.getGenerations({
  status: "completed",
  model: "nano-banana-2",
});
```

## Error Handling

```typescript
import { AIImageClient, APIError, TimeoutError } from "ai-image-cli";

try {
  await client.generateMedia({ prompt: "test", model: "bad" });
} catch (error) {
  if (error instanceof APIError) {
    console.error(`Status ${error.statusCode}: ${error.message}`);
    if (error.isRateLimited) console.error("Rate limited, slow down");
    if (error.isUnauthorized) console.error("Check your API key");
  }
  if (error instanceof TimeoutError) {
    console.error(`Generation ${error.generationId} timed out`);
  }
}
```

## All Exported Types

```typescript
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

## API Reference

For the full API specification, visit [api.kubeez.com/docs](https://api.kubeez.com/docs).
