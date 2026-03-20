import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerUploadCommand(program: Command): void {
  program
    .command("upload")
    .description("Upload a media file for use in generations")
    .requiredOption("-f, --file <path>", "File path to upload")
    .option("-b, --bucket <bucket>", "Storage bucket", "media-inputs")
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.uploadMedia(options.file, options.bucket);
      printResult(result);
    });
}
