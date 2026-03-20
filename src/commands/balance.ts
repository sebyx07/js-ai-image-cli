import type { Command } from "commander";
import { createClient, printResult } from "../helpers";

export function registerBalanceCommand(program: Command): void {
  program
    .command("balance")
    .description("Check your account balance")
    .option("--json", "Output raw JSON", false)
    .action(async (options: Record<string, any>) => {
      const client = createClient();
      const result = await client.getBalance();

      if (options.json) {
        printResult(result);
      } else {
        console.log(`Credits: ${result.credits}`);
        console.log(result.message);
      }
    });
}
