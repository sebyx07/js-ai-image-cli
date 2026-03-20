import type { Command } from "commander";
import { createClient, formatTable, printResult } from "../helpers";

export function registerModelsCommand(program: Command): void {
  program
    .command("models")
    .description("List available AI models")
    .option("-t, --type <type>", "Filter by model type (image, video, music, speech)")
    .option("--json", "Output raw JSON instead of table", false)
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.getModels(options.type);

      if (options.json) {
        printResult(result);
        return;
      }

      if (!result.models || result.models.length === 0) {
        console.log("No models found.");
        return;
      }

      const table = formatTable(result.models, [
        { key: "model_id", header: "Model" },
        { key: "display_name", header: "Name" },
        { key: "model_type", header: "Type" },
        { key: "provider", header: "Provider" },
        { key: "cost_per_generation", header: "Credits" },
        { key: "estimated_time_seconds", header: "Est. Time (s)" },
      ]);

      console.log(table);
      console.log(`\n${result.models.length} models available`);
    });
}
