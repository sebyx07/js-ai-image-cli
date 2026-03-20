import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerAdCopyCommand(program: Command): void {
  program
    .command("ad-copy")
    .description("Generate AI ad copy from a reference ad")
    .requiredOption("-r, --reference-url <url>", "Reference ad URL")
    .option("-i, --product-image <url>", "Product image URL", "")
    .option("-t, --product-text <text>", "Product description text", "")
    .option("-l, --language <lang>", "Language code", "en")
    .option("-v, --variants <count>", "Number of variants", "1")
    .option("-a, --aspect-ratio <ratio>", "Aspect ratio", "9:16")
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.generateAdCopy({
        reference_ad_url: options.referenceUrl,
        product_image_url: options.productImage,
        product_text: options.productText,
        language: options.language,
        variant_count: Number.parseInt(options.variants, 10),
        aspect_ratio: options.aspectRatio,
      });
      printResult(result);
    });
}
