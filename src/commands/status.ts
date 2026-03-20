import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerStatusCommand(program: Command): void {
  program
    .command("status")
    .description("Check the status of a generation")
    .requiredOption("-i, --id <id>", "Generation ID")
    .option("-t, --type <type>", "Generation type (media or music)", "media")
    .option("-w, --wait", "Wait for generation to complete", false)
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const type = options.type as "media" | "music";

      if (options.wait) {
        console.log("Waiting for completion...");
        const result = await client.pollForCompletion(options.id, type);
        printResult(result);
      } else {
        const result =
          type === "media" ? await client.getMediaStatus(options.id) : await client.getMusicStatus(options.id);
        printResult(result);
      }
    });
}
