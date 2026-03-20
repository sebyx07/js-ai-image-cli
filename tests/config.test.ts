import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

describe("config file operations", () => {
  const testDir = path.join(os.tmpdir(), `ai-image-cli-test-${Date.now()}`);
  const testConfigFile = path.join(testDir, "config.json");

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
  });

  it("should create config directory and write config", () => {
    fs.mkdirSync(testDir, { recursive: true });
    const config = { apiKey: "test-key-123" };
    fs.writeFileSync(testConfigFile, JSON.stringify(config, null, 2));

    const loaded = JSON.parse(fs.readFileSync(testConfigFile, "utf-8"));
    expect(loaded.apiKey).toBe("test-key-123");
  });

  it("should handle missing config file", () => {
    expect(fs.existsSync(testConfigFile)).toBe(false);
  });

  it("should overwrite existing config", () => {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testConfigFile, JSON.stringify({ apiKey: "old-key" }));
    fs.writeFileSync(testConfigFile, JSON.stringify({ apiKey: "new-key" }));

    const loaded = JSON.parse(fs.readFileSync(testConfigFile, "utf-8"));
    expect(loaded.apiKey).toBe("new-key");
  });

  it("should handle corrupt config gracefully", () => {
    fs.mkdirSync(testDir, { recursive: true });
    fs.writeFileSync(testConfigFile, "not valid json{{{");

    let result = {};
    try {
      result = JSON.parse(fs.readFileSync(testConfigFile, "utf-8"));
    } catch {
      result = {};
    }
    expect(result).toEqual({});
  });
});
