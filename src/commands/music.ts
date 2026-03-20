import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerMusicCommand(program: Command): void {
  program
    .command("music")
    .description("Generate AI music")
    .requiredOption("-p, --prompt <prompt>", "Music generation prompt")
    .option("-m, --model <model>", "Model version", "V5")
    .option("-i, --instrumental", "Instrumental only (no vocals)", false)
    .option("-w, --wait", "Wait for generation to complete", false)
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.generateMusic({
        prompt: options.prompt,
        model: options.model,
        instrumental: options.instrumental,
      });

      const genId = result.generation_id;
      if (options.wait && genId) {
        console.log(`Music generation started: ${genId}`);
        console.log("Waiting for completion...");
        const final = await client.pollForCompletion(genId, "music");
        printResult(final);
      } else {
        printResult(result);
      }
    });
}
