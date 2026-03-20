# CLI Reference

Complete reference for all `ai-image` commands.

## Setup

```bash
# Option 1: Login command (saves to ~/.ai-image-cli)
ai-image login YOUR_API_KEY

# Option 2: Environment variable
export AI_IMAGE_API_KEY=your_api_key_here
```

Get your key at [kubeez.com](https://kubeez.com) or [dev.kubeez.com/settings/api-keys](https://dev.kubeez.com/settings/api-keys).

---

## Authentication Commands

### `login`

```
ai-image login <api-key>
```

Save your API key to `~/.ai-image-cli/config.json` (file permissions: `600`).

### `logout`

```
ai-image logout
```

Remove the saved API key.

### `whoami`

```
ai-image whoami
```

Show your current API key (masked) and account balance.

---

## Generation Commands

### `models`

List available AI models with pricing.

```
ai-image models [options]
```

| Option | Description |
|--------|-------------|
| `-t, --type <type>` | Filter: `image`, `video`, `music`, `speech` |
| `--json` | Output raw JSON instead of table |

### `generate`

Generate images and videos.

```
ai-image generate [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --prompt <text>` | Prompt (required) | — |
| `-m, --model <name>` | Model (required) | — |
| `-t, --type <type>` | Generation type | `text-to-image` |
| `-n, --negative-prompt <text>` | What to avoid | `""` |
| `-a, --aspect-ratio <ratio>` | Aspect ratio | `1:1` |
| `-d, --duration <sec>` | Video duration | — |
| `-q, --quality <level>` | Quality | — |
| `-s, --seed <number>` | Reproducibility seed | `0` |
| `--sound` | Audio for video | `false` |
| `--fixed-lens` | Fixed camera | `false` |
| `--source-urls <url...>` | Source media URLs | — |
| `-w, --wait` | Poll until done | `false` |

**Generation types:** `text-to-image`, `image-to-image`, `text-to-video`, `image-to-video`

### `music`

Generate AI music tracks.

```
ai-image music [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --prompt <text>` | Prompt (required) | — |
| `-m, --model <version>` | Model version | `V5` |
| `-i, --instrumental` | No vocals | `false` |
| `-w, --wait` | Poll until done | `false` |

### `dialogue`

Generate multi-speaker dialogue audio (TTS).

```
ai-image dialogue [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-d, --dialogue <json>` | JSON array (required) | — |
| `-s, --stability <0-1>` | Voice stability | `0.5` |
| `-l, --language <code>` | Language | `auto` |

JSON format: `[{"text": "Hello!", "voice": "Adam"}, {"text": "Hi!", "voice": "Emily"}]`

### `ad-copy`

Generate ad variants from a reference ad.

```
ai-image ad-copy [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-r, --reference-url <url>` | Reference ad (required) | — |
| `-i, --product-image <url>` | Product image | `""` |
| `-t, --product-text <text>` | Product description | `""` |
| `-l, --language <code>` | Language | `en` |
| `-v, --variants <n>` | Variant count | `1` |
| `-a, --aspect-ratio <ratio>` | Aspect ratio | `9:16` |

---

## Utility Commands

### `upload`

Upload media for use in generations.

```
ai-image upload [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --file <path>` | File (required) | — |
| `-b, --bucket <name>` | Bucket | `media-inputs` |

### `status`

Check generation status.

```
ai-image status [options]
```

| Option | Description | Default |
|--------|-------------|---------|
| `-i, --id <id>` | Generation ID (required) | — |
| `-t, --type <type>` | `media` or `music` | `media` |
| `-w, --wait` | Poll until done | `false` |

### `balance`

Show account credits.

```
ai-image balance [--json]
```

### `generations`

List past generations.

```
ai-image generations [options]
```

| Option | Description |
|--------|-------------|
| `-s, --status <status>` | Filter by status |
| `-m, --model <model>` | Filter by model |
| `-t, --type <type>` | Filter by type |
