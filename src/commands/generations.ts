import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerGenerationsCommand(program: Command): void {
  program
    .command("generations")
    .description("List your generations")
    .option("-s, --status <status>", "Filter by status")
    .option("-m, --model <model>", "Filter by model")
    .option("-t, --type <type>", "Filter by generation type")
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.getGenerations({
        status: options.status,
        model: options.model,
        generation_type: options.type,
      });
      printResult(result);
    });
}
