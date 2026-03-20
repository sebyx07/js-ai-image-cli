import type { Command } from "commander";
import { getConfigDir, loadConfig, saveConfig } from "../config";

export function registerLoginCommand(program: Command): void {
  program
    .command("login <api-key>")
    .description("Save your API key to ~/.ai-image-cli/config.json")
    .action((apiKey: string) => {
      const config = loadConfig();
      config.apiKey = apiKey;
      saveConfig(config);
      console.log(`API key saved to ${getConfigDir()}/config.json`);
      console.log("You can now use ai-image commands without setting an environment variable.");
    });

  program
    .command("logout")
    .description("Remove your saved API key")
    .action(() => {
      const config = loadConfig();
      config.apiKey = undefined;
      saveConfig(config);
      console.log("API key removed.");
    });

  program
    .command("whoami")
    .description("Show current API key status and account balance")
    .action(async () => {
      const { getApiKey } = await import("../config");
      const { AIImageClient } = await import("../client");

      let apiKey: string;
      try {
        apiKey = getApiKey();
      } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        return;
      }

      const masked = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
      const source = process.env.AI_IMAGE_API_KEY ? "environment variable" : "~/.ai-image-cli/config.json";
      console.log(`API Key: ${masked} (from ${source})`);

      try {
        const client = new AIImageClient({ apiKey, baseUrl: process.env.AI_IMAGE_API_URL });
        const balance = await client.getBalance();
        console.log(`Credits: ${balance.credits}`);
      } catch (error) {
        console.error(`Could not fetch balance: ${error instanceof Error ? error.message : error}`);
      }
    });
}
