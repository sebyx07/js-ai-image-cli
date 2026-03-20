# Getting Started

A step-by-step guide to generating your first AI image with `ai-media-cli`.

## 1. Get Your API Key

Sign up at [kubeez.com](https://kubeez.com) and grab your API key from the [API settings page](https://dev.kubeez.com/settings/api-keys).

Kubeez offers a free trial with credits included, so you can start generating right away.

## 2. Install

Choose one of these methods:

```bash
# Option A: Global install (recommended)
npm install -g ai-media-cli

# Option B: Use with npx (no install)
npx ai-media-cli --help

# Option C: Install with Bun
bun install -g ai-media-cli
```

## 3. Authenticate

```bash
ai-image login YOUR_API_KEY
```

Your key is saved securely to `~/.ai-media-cli/config.json` with `600` file permissions. You only need to do this once.

Verify it works:

```bash
ai-image whoami
# API Key: sk_live_...xxxx (from ~/.ai-media-cli/config.json)
# Credits: 100
```

## 4. Explore Available Models

```bash
# See all models in a nice table
ai-image models

# Filter by type
ai-image models --type image
ai-image models --type video
ai-image models --type music
```

This shows model names, providers, costs (in credits), and estimated generation times.

## 5. Generate Your First Image

```bash
ai-image generate \
  -p "a cozy coffee shop on a rainy day, warm lighting, watercolor style" \
  -m nano-banana-2 \
  --wait
```

The `--wait` flag polls until the generation completes and prints the result with the output URL.

Without `--wait`, you get the generation ID immediately and can check status later:

```bash
ai-image generate -p "a sunset over the ocean" -m nano-banana-2
# Returns: { "generation_id": "abc-123", ... }

ai-image status -i abc-123
# Returns current status

ai-image status -i abc-123 --wait
# Polls until done
```

## 6. Try More Features

### Video

```bash
ai-image generate \
  -p "ocean waves crashing on a rocky coast" \
  -m kling-v2 \
  --type text-to-video \
  --duration 5 \
  --sound \
  --wait
```

### Music

```bash
ai-image music \
  -p "upbeat lo-fi hip hop beat, relaxing, study music" \
  --instrumental \
  --wait
```

### Text-to-Speech

```bash
ai-image dialogue -d '[
  {"text": "Hey, welcome to the show!", "voice": "Adam"},
  {"text": "Thanks for having me!", "voice": "Emily"}
]'
```

### Image-to-Image

```bash
# Upload your source image
ai-image upload -f ./my-photo.jpg

# Use the returned URL to transform it
ai-image generate \
  -p "turn this into an oil painting" \
  -m 5-lite-image-to-image \
  --type image-to-image \
  --source-urls YOUR_UPLOADED_URL \
  --wait
```

## 7. Check Your Balance

```bash
ai-image balance
```

Need more credits? Visit [kubeez.com/pricing](https://kubeez.com/pricing).

## Next Steps

- See all commands: `ai-image --help`
- Full CLI reference: [docs/CLI_REFERENCE.md](./CLI_REFERENCE.md)
- Use as a library: [docs/LIBRARY_USAGE.md](./LIBRARY_USAGE.md)
- API docs: [api.kubeez.com/docs](https://api.kubeez.com/docs)
