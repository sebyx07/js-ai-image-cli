# Contributing

Contributions are welcome! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/sebyx07/js-ai-image-cli.git
cd js-ai-image-cli
bun install
```

## Running Locally

```bash
# Run the CLI in dev mode
bun run dev -- generate -p "test prompt" -m nano-banana-2

# Run tests
bun test

# Lint
bun run lint

# Fix lint issues
bun run lint:fix

# Build
bun run build
```

## Project Structure

```
src/
  bin/cli.ts        # CLI entry point
  client.ts         # AIImageClient - HTTP client
  config.ts         # Config file management (~/.ai-image-cli)
  errors.ts         # Custom error classes
  helpers.ts        # Shared utilities (formatting, etc.)
  index.ts          # Library exports
  types.ts          # TypeScript interfaces
  commands/         # CLI command handlers
tests/              # Test files
docs/               # Additional documentation
.github/workflows/  # CI/CD pipelines
```

## Submitting Changes

1. Fork the repo
2. Create a feature branch (`git checkout -b my-feature`)
3. Make your changes
4. Run `bun test` and `bun run lint`
5. Commit and push
6. Open a Pull Request

## Reporting Issues

Open an issue at [github.com/sebyx07/js-ai-image-cli/issues](https://github.com/sebyx07/js-ai-image-cli/issues).
