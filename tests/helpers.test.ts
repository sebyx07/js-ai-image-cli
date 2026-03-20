import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { formatJson, formatTable, getApiKey } from "../src/helpers";

describe("formatJson", () => {
  it("should format object as pretty JSON", () => {
    const result = formatJson({ key: "value" });
    expect(result).toBe('{\n  "key": "value"\n}');
  });

  it("should format arrays", () => {
    const result = formatJson([1, 2, 3]);
    expect(result).toBe("[\n  1,\n  2,\n  3\n]");
  });

  it("should handle null", () => {
    const result = formatJson(null);
    expect(result).toBe("null");
  });

  it("should handle nested objects", () => {
    const result = formatJson({ a: { b: "c" } });
    expect(result).toContain('"b": "c"');
  });
});

describe("formatTable", () => {
  it("should format rows as aligned table", () => {
    const rows = [
      { name: "Alice", age: "30" },
      { name: "Bob", age: "25" },
    ];
    const columns = [
      { key: "name", header: "Name" },
      { key: "age", header: "Age" },
    ];
    const result = formatTable(rows, columns);

    expect(result).toContain("Name");
    expect(result).toContain("Age");
    expect(result).toContain("Alice");
    expect(result).toContain("Bob");
    expect(result).toContain("---");
  });

  it("should handle empty rows", () => {
    const result = formatTable([], [{ key: "name", header: "Name" }]);
    expect(result).toContain("Name");
    expect(result).toContain("---");
  });

  it("should handle missing keys gracefully", () => {
    const rows = [{ name: "Alice" }];
    const columns = [
      { key: "name", header: "Name" },
      { key: "missing", header: "Missing" },
    ];
    const result = formatTable(rows, columns);
    expect(result).toContain("Alice");
  });

  it("should pad columns to widest value", () => {
    const rows = [{ name: "A" }, { name: "Very Long Name" }];
    const columns = [{ key: "name", header: "Name" }];
    const result = formatTable(rows, columns);
    const lines = result.split("\n");
    // Header and separator should be at least as wide as the longest value
    expect(lines[1].length).toBeGreaterThanOrEqual("Very Long Name".length);
  });
});

describe("getApiKey", () => {
  let originalKey: string | undefined;

  beforeEach(() => {
    originalKey = process.env.AI_IMAGE_API_KEY;
  });

  afterEach(() => {
    if (originalKey !== undefined) {
      process.env.AI_IMAGE_API_KEY = originalKey;
    } else {
      process.env.AI_IMAGE_API_KEY = undefined;
    }
  });

  it("should return the API key from env var", () => {
    process.env.AI_IMAGE_API_KEY = "test-key-123";
    expect(getApiKey()).toBe("test-key-123");
  });
});
