import { AIImageClient } from "./client";
import { getApiKey } from "./config";

export { getApiKey } from "./config";

export function createClient(): AIImageClient {
  return new AIImageClient({
    apiKey: getApiKey(),
    baseUrl: process.env.AI_IMAGE_API_URL,
  });
}

export function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function printResult(data: unknown): void {
  console.log(formatJson(data));
}

export function formatTable(rows: Record<string, unknown>[], columns: { key: string; header: string }[]): string {
  const widths = columns.map((col) => {
    const values = rows.map((row) => String(row[col.key] ?? ""));
    return Math.max(col.header.length, ...values.map((v) => v.length));
  });

  const header = columns.map((col, i) => col.header.padEnd(widths[i])).join("  ");
  const separator = widths.map((w) => "-".repeat(w)).join("  ");
  const body = rows
    .map((row) => columns.map((col, i) => String(row[col.key] ?? "").padEnd(widths[i])).join("  "))
    .join("\n");

  return `${header}\n${separator}\n${body}`;
}
