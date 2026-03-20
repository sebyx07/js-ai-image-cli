# Available Models & Pricing

> Run `ai-image models` for real-time pricing. The tables below are a snapshot — models and prices update frequently.

## Image Models

| Model | Provider | Credits | Est. Time | Generation Types |
|-------|----------|---------|-----------|-----------------|
| `nano-banana-2` | Kubeez | ~14 | ~26s | text-to-image |
| `nano-banana-2-2K` | Kubeez | ~20 | ~30s | text-to-image (2K) |
| `nano-banana-2-4K` | Kubeez | ~28 | ~45s | text-to-image (4K) |
| `nano-banana-pro` | Kubeez | ~20 | ~30s | text-to-image |
| `nano-banana-pro-2K` | Kubeez | ~28 | ~40s | text-to-image (2K) |
| `nano-banana-pro-4K` | Kubeez | ~40 | ~60s | text-to-image (4K) |
| `flux-2-1K` | Black Forest Labs | varies | varies | text-to-image |
| `flux-2-2K` | Black Forest Labs | varies | varies | text-to-image |
| `5-lite-text-to-image` | ByteDance (Seedream) | 12 | ~38s | text-to-image, image-to-image |
| `5-lite-image-to-image` | ByteDance (Seedream) | 12 | ~209s | image-to-image |
| `seedream-v4` | ByteDance | varies | varies | text-to-image |
| `seedream-v4-5` | ByteDance | varies | varies | text-to-image |
| `imagen-4` | Google | ~13 | varies | text-to-image |
| `imagen-4-fast` | Google | ~7 | varies | text-to-image |
| `imagen-4-ultra` | Google | varies | varies | text-to-image |
| `gpt-1.5-image-high` | OpenAI | ~50 | varies | text-to-image |
| `gpt-1.5-image-medium` | OpenAI | ~35 | varies | text-to-image |
| `grok-text-to-image` | xAI | varies | varies | text-to-image |
| `Z-image` | Zhipu | varies | varies | text-to-image |

## Video Models

| Model | Provider | Credits | Features |
|-------|----------|---------|----------|
| `kling-v2` | Kuaishou | varies | text-to-video, image-to-video, sound support |
| `wan-x` | Alibaba | varies | text-to-video |
| `veo-2` | Google | varies | text-to-video |

## Music Models

| Model | Provider | Features |
|-------|----------|----------|
| `V5` (default) | Suno | Vocals + instrumental, various genres |

## Pricing

Kubeez uses a **credit-based** system. Each generation costs a certain number of credits depending on the model.

### Plans

| Plan | Best For |
|------|----------|
| **Free Trial** | Testing the platform (free credits on signup) |
| **Starter** | Experimentation and light use |
| **Advanced** | Regular use with standard models |
| **Pro** | Full experience, most popular |
| **Studio Pro** | High-volume professional use |
| **Powerhouse** | Maximum value, highest efficiency |

Plans offer **4-44% savings** vs. pay-as-you-go pricing. Yearly billing saves an additional ~16%.

See full pricing at [kubeez.com/pricing](https://kubeez.com/pricing).

## Checking Prices

The easiest way to see current prices:

```bash
# Table view with costs
ai-image models

# Filter by type
ai-image models --type image

# Raw JSON with all details
ai-image models --json
```

Check your remaining balance:

```bash
ai-image balance
```
