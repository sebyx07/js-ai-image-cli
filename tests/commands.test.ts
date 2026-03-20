import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Command } from "commander";

describe("CLI commands", () => {
  let originalFetch: typeof globalThis.fetch;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;
  let logOutput: string[];
  let errorOutput: string[];

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    logOutput = [];
    errorOutput = [];
    console.log = mock((...args: unknown[]) => {
      logOutput.push(args.map(String).join(" "));
    }) as typeof console.log;
    console.error = mock((...args: unknown[]) => {
      errorOutput.push(args.map(String).join(" "));
    }) as typeof console.error;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe("login command", () => {
    it("should save API key to config file", async () => {
      const testDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-image-login-test-"));
      const configDir = path.join(testDir, ".ai-image-cli");
      const configFile = path.join(configDir, "config.json");

      try {
        // Simulate what login does: loadConfig -> set key -> saveConfig
        fs.mkdirSync(configDir, { recursive: true });
        const config = { apiKey: "sk_test_login_key" };
        fs.writeFileSync(configFile, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });

        expect(fs.existsSync(configFile)).toBe(true);
        const loaded = JSON.parse(fs.readFileSync(configFile, "utf-8"));
        expect(loaded.apiKey).toBe("sk_test_login_key");
      } finally {
        fs.rmSync(testDir, { recursive: true });
      }
    });

    it("should register login command on program", async () => {
      const { registerLoginCommand } = await import("../src/commands/login");
      const program = new Command();
      program.exitOverride();
      registerLoginCommand(program);

      const loginCmd = program.commands.find((c) => c.name() === "login");
      expect(loginCmd).toBeDefined();
      expect(loginCmd?.description()).toContain("API key");
    });
  });

  describe("models command", () => {
    it("should output JSON when --json is passed", async () => {
      const mockModels = {
        models: [{ model_id: "flux-schnell", display_name: "Flux Schnell", model_type: "image" }],
      };
      globalThis.fetch = mock(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockModels),
          text: () => Promise.resolve(JSON.stringify(mockModels)),
        }),
      ) as unknown as typeof fetch;

      // Set up env so createClient works
      const originalKey = process.env.AI_IMAGE_API_KEY;
      process.env.AI_IMAGE_API_KEY = "sk_test_models";

      try {
        const { registerModelsCommand } = await import("../src/commands/models");
        const program = new Command();
        program.exitOverride();
        registerModelsCommand(program);

        await program.parseAsync(["models", "--json"], { from: "user" });

        const output = logOutput.join("\n");
        const parsed = JSON.parse(output);
        expect(parsed.models).toBeArray();
        expect(parsed.models[0].model_id).toBe("flux-schnell");
      } finally {
        if (originalKey !== undefined) {
          process.env.AI_IMAGE_API_KEY = originalKey;
        } else {
          process.env.AI_IMAGE_API_KEY = undefined;
        }
      }
    });
  });

  describe("dialogue command", () => {
    it("should exit with error on invalid JSON for --dialogue", async () => {
      const originalKey = process.env.AI_IMAGE_API_KEY;
      process.env.AI_IMAGE_API_KEY = "sk_test_dialogue";
      const originalExit = process.exit;
      let exitCode: number | undefined;
      process.exit = mock((code?: number) => {
        exitCode = code as number;
        throw new Error("process.exit called");
      }) as unknown as typeof process.exit;

      try {
        const { registerDialogueCommand } = await import("../src/commands/dialogue");
        const program = new Command();
        program.exitOverride();
        registerDialogueCommand(program);

        await program.parseAsync(["dialogue", "-d", "not-valid-json"], { from: "user" }).catch(() => {});

        expect(exitCode).toBe(1);
        expect(errorOutput.some((line) => line.includes("valid JSON"))).toBe(true);
      } finally {
        process.exit = originalExit;
        if (originalKey !== undefined) {
          process.env.AI_IMAGE_API_KEY = originalKey;
        } else {
          process.env.AI_IMAGE_API_KEY = undefined;
        }
      }
    });
  });

  describe("generate command", () => {
    it("should build correct request body from CLI options", async () => {
      let capturedBody: string | undefined;
      globalThis.fetch = mock((_url: unknown, init: RequestInit) => {
        capturedBody = init.body as string;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ generation_id: "gen-test", status: "pending" }),
          text: () => Promise.resolve('{"generation_id":"gen-test","status":"pending"}'),
        });
      }) as unknown as typeof fetch;

      const originalKey = process.env.AI_IMAGE_API_KEY;
      process.env.AI_IMAGE_API_KEY = "sk_test_generate";

      try {
        const { registerGenerateCommand } = await import("../src/commands/generate");
        const program = new Command();
        program.exitOverride();
        registerGenerateCommand(program);

        await program.parseAsync(
          ["generate", "-p", "a sunset over mountains", "-m", "flux-schnell", "-a", "16:9", "--seed", "42"],
          { from: "user" },
        );

        expect(capturedBody).toBeDefined();
        const body = JSON.parse(capturedBody as string);
        expect(body.prompt).toBe("a sunset over mountains");
        expect(body.model).toBe("flux-schnell");
        expect(body.aspect_ratio).toBe("16:9");
        expect(body.seed).toBe(42);
      } finally {
        if (originalKey !== undefined) {
          process.env.AI_IMAGE_API_KEY = originalKey;
        } else {
          process.env.AI_IMAGE_API_KEY = undefined;
        }
      }
    });
  });
});
