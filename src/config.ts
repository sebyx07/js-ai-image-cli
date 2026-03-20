import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ConfigError } from "./errors";

const CONFIG_DIR = path.join(os.homedir(), ".ai-image-cli");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export interface Config {
  apiKey?: string;
  apiUrl?: string;
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function loadConfig(): Config {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // ignore corrupt config
  }
  return {};
}

export function saveConfig(config: Config): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
}

export function getApiKey(): string {
  // 1. Environment variable takes priority
  const envKey = process.env.AI_IMAGE_API_KEY;
  if (envKey) return envKey;

  // 2. Config file
  const config = loadConfig();
  if (config.apiKey) return config.apiKey;

  console.error("Error: No API key found.");
  console.error("");
  console.error("Set it with one of:");
  console.error("  ai-media-cli login YOUR_API_KEY");
  console.error("  export AI_IMAGE_API_KEY=your_api_key");
  console.error("");
  console.error("Get your API key at: https://kubeez.com");
  throw new ConfigError("No API key found");
}
