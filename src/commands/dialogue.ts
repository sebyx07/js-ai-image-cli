import type { Command } from "commander";
import { createClient, printResult } from "../helpers";
import type { DialogueLine } from "../types";

export function registerDialogueCommand(program: Command): void {
  program
    .command("dialogue")
    .description("Generate multi-speaker dialogue audio (text-to-speech)")
    .requiredOption("-d, --dialogue <json>", 'Dialogue as JSON array, e.g. \'[{"text":"Hello","voice":"Adam"}]\'')
    .option("-s, --stability <number>", "Voice stability (0-1)", "0.5")
    .option("-l, --language <code>", "Language code", "auto")
    .action(async (options: Record<string, any>) => {
      let dialogue: DialogueLine[];
      try {
        dialogue = JSON.parse(options.dialogue);
      } catch {
        console.error("Error: --dialogue must be valid JSON");
        process.exit(1);
      }

      const client = createClient();
      const result = await client.generateDialogue({
        dialogue,
        stability: Number.parseFloat(options.stability),
        language_code: options.language,
      });
      printResult(result);
    });
}
