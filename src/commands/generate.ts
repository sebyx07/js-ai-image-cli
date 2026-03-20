import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerGenerateCommand(program: Command): void {
  program
    .command("generate")
    .description("Generate AI media (image, video, etc.)")
    .requiredOption("-p, --prompt <prompt>", "Generation prompt")
    .requiredOption("-m, --model <model>", "Model to use")
    .option("-t, --type <type>", "Generation type", "text-to-image")
    .option("-n, --negative-prompt <prompt>", "Negative prompt", "")
    .option("-a, --aspect-ratio <ratio>", "Aspect ratio", "1:1")
    .option("-d, --duration <duration>", "Duration (for video)")
    .option("-q, --quality <quality>", "Quality setting")
    .option("-s, --seed <seed>", "Seed for reproducibility", "0")
    .option("--sound", "Enable sound (for video)", false)
    .option("--fixed-lens", "Fixed lens mode", false)
    .option("--source-urls <urls...>", "Source media URLs")
    .option("-w, --wait", "Wait for generation to complete", false)
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.generateMedia({
        prompt: options.prompt,
        model: options.model,
        generation_type: options.type,
        negative_prompt: options.negativePrompt,
        aspect_ratio: options.aspectRatio,
        duration: options.duration || "",
        quality: options.quality || null,
        seed: Number.parseInt(options.seed, 10),
        sound: options.sound,
        fixed_lens: options.fixedLens,
        source_media_urls: options.sourceUrls || null,
      });

      const genId = result.generation_id;
      if (options.wait && genId) {
        console.log(`Generation started: ${genId}`);
        console.log("Waiting for completion...");
        const final = await client.pollForCompletion(genId, "media");
        printResult(final);
      } else {
        printResult(result);
      }
    });
}
