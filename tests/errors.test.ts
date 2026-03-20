import { describe, expect, it } from "bun:test";
import { APIError, ConfigError, TimeoutError } from "../src/errors";

describe("APIError", () => {
  it("should parse JSON error message", () => {
    const error = new APIError(400, '{"message":"Invalid model"}');
    expect(error.message).toBe("Invalid model");
    expect(error.statusCode).toBe(400);
  });

  it("should parse error with message from JSON", () => {
    const error = new APIError(400, '{"error":"invalid_model","message":"Unknown model: test"}');
    expect(error.message).toContain("Unknown model: test");
  });

  it("should parse error field when no message", () => {
    const error = new APIError(400, '{"error":"invalid_model"}');
    expect(error.message).toContain("invalid_model");
  });

  it("should parse detail field from JSON", () => {
    const error = new APIError(422, '{"detail":"Validation failed"}');
    expect(error.message).toBe("Validation failed");
  });

  it("should handle non-JSON response body", () => {
    const error = new APIError(500, "Internal Server Error");
    expect(error.message).toContain("API error 500");
    expect(error.message).toContain("Internal Server Error");
  });

  it("should identify 401 as unauthorized", () => {
    const error = new APIError(401, "{}");
    expect(error.isUnauthorized).toBe(true);
    expect(error.isNotFound).toBe(false);
  });

  it("should identify 404 as not found", () => {
    const error = new APIError(404, "{}");
    expect(error.isNotFound).toBe(true);
    expect(error.isUnauthorized).toBe(false);
  });

  it("should identify 422 as validation error", () => {
    const error = new APIError(422, "{}");
    expect(error.isValidationError).toBe(true);
  });

  it("should identify 429 as rate limited", () => {
    const error = new APIError(429, "{}");
    expect(error.isRateLimited).toBe(true);
  });

  it("should identify 500+ as server error", () => {
    expect(new APIError(500, "{}").isServerError).toBe(true);
    expect(new APIError(502, "{}").isServerError).toBe(true);
    expect(new APIError(503, "{}").isServerError).toBe(true);
    expect(new APIError(400, "{}").isServerError).toBe(false);
  });

  it("should preserve response body", () => {
    const body = '{"detail":"some error"}';
    const error = new APIError(400, body);
    expect(error.responseBody).toBe(body);
  });

  it("should have correct name", () => {
    const error = new APIError(400, "{}");
    expect(error.name).toBe("APIError");
  });
});

describe("ConfigError", () => {
  it("should create with message", () => {
    const error = new ConfigError("No API key found");
    expect(error.message).toBe("No API key found");
    expect(error.name).toBe("ConfigError");
  });
});

describe("TimeoutError", () => {
  it("should create with generation id and attempts", () => {
    const error = new TimeoutError("gen-123", 200);
    expect(error.generationId).toBe("gen-123");
    expect(error.attempts).toBe(200);
    expect(error.name).toBe("TimeoutError");
    expect(error.message).toContain("gen-123");
    expect(error.message).toContain("200");
  });
});
