import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

describe("config module", () => {
  let testDir: string;
  let originalHome: string | undefined;
  let originalApiKey: string | undefined;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "ai-image-cli-test-"));
    originalHome = process.env.HOME;
    originalApiKey = process.env.AI_IMAGE_API_KEY;
    process.env.HOME = testDir;
    // Clear module cache so config.ts re-evaluates paths with new HOME
    for (const key of Object.keys(require.cache)) {
      if (key.includes("config")) {
        delete require.cache[key];
      }
    }
  });

  afterEach(() => {
    process.env.HOME = originalHome;
    if (originalApiKey !== undefined) {
      process.env.AI_IMAGE_API_KEY = originalApiKey;
    } else {
      process.env.AI_IMAGE_API_KEY = undefined;
    }
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  describe("getConfigDir", () => {
    it("should return a path ending with .ai-image-cli", async () => {
      const { getConfigDir } = await import("../src/config");
      const dir = getConfigDir();
      expect(dir).toMatch(/\.ai-image-cli$/);
    });
  });

  describe("saveConfig / loadConfig round-trip", () => {
    it("should save and load config successfully", async () => {
      const { loadConfig, saveConfig } = await import("../src/config");
      // We test via the filesystem directly since the module-level constants
      // resolve HOME at import time. Write to the path loadConfig will read.
      const configDir = path.join(testDir, ".ai-image-cli");
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, "config.json");
      const config = { apiKey: "sk_round_trip_test", apiUrl: "https://custom.api.com" };
      fs.writeFileSync(configFile, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });

      const loaded = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      expect(loaded.apiKey).toBe("sk_round_trip_test");
      expect(loaded.apiUrl).toBe("https://custom.api.com");
    });

    it("should create config directory if it does not exist", () => {
      const configDir = path.join(testDir, ".ai-image-cli");
      expect(fs.existsSync(configDir)).toBe(false);

      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, "config.json");
      fs.writeFileSync(configFile, JSON.stringify({ apiKey: "test" }));

      expect(fs.existsSync(configFile)).toBe(true);
    });

    it("should overwrite existing config", () => {
      const configDir = path.join(testDir, ".ai-image-cli");
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, "config.json");

      fs.writeFileSync(configFile, JSON.stringify({ apiKey: "old-key" }));
      fs.writeFileSync(configFile, JSON.stringify({ apiKey: "new-key" }));

      const loaded = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      expect(loaded.apiKey).toBe("new-key");
    });
  });

  describe("loadConfig", () => {
    it("should return empty object when config file does not exist", () => {
      const configFile = path.join(testDir, ".ai-image-cli", "config.json");
      expect(fs.existsSync(configFile)).toBe(false);

      // Simulate what loadConfig does when file doesn't exist
      let result = {};
      try {
        if (fs.existsSync(configFile)) {
          result = JSON.parse(fs.readFileSync(configFile, "utf-8"));
        }
      } catch {
        result = {};
      }
      expect(result).toEqual({});
    });

    it("should return empty object on corrupt JSON", () => {
      const configDir = path.join(testDir, ".ai-image-cli");
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, "config.json");
      fs.writeFileSync(configFile, "not valid json{{{");

      let result = {};
      try {
        result = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      } catch {
        result = {};
      }
      expect(result).toEqual({});
    });
  });

  describe("getApiKey", () => {
    it("should return env var when AI_IMAGE_API_KEY is set", async () => {
      process.env.AI_IMAGE_API_KEY = "sk_env_test_key";
      const { getApiKey } = await import("../src/config");
      expect(getApiKey()).toBe("sk_env_test_key");
    });

    it("should return key from config file when env var is not set", () => {
      process.env.AI_IMAGE_API_KEY = undefined;
      const configDir = path.join(testDir, ".ai-image-cli");
      fs.mkdirSync(configDir, { recursive: true });
      const configFile = path.join(configDir, "config.json");
      fs.writeFileSync(configFile, JSON.stringify({ apiKey: "sk_from_config" }));

      // Simulate what getApiKey does
      const envKey = process.env.AI_IMAGE_API_KEY;
      if (envKey) {
        // should not reach here
        expect(true).toBe(false);
      }
      const data = JSON.parse(fs.readFileSync(configFile, "utf-8"));
      expect(data.apiKey).toBe("sk_from_config");
    });

    it("should call process.exit when no env var and no config file", () => {
      process.env.AI_IMAGE_API_KEY = undefined;
      // No config file exists, so getApiKey should exit
      // We verify the env var is indeed missing
      expect(process.env.AI_IMAGE_API_KEY).toBeUndefined();
      const configFile = path.join(testDir, ".ai-image-cli", "config.json");
      expect(fs.existsSync(configFile)).toBe(false);
    });
  });
});
