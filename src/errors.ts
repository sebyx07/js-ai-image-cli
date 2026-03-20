export class APIError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: string;

  constructor(statusCode: number, responseBody: string) {
    const parsed = APIError.tryParseMessage(responseBody);
    super(parsed || `API error ${statusCode}: ${responseBody}`);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }

  private static tryParseMessage(body: string): string | null {
    try {
      const json = JSON.parse(body);
      if (json.message) return json.message;
      if (json.error) return `${json.error}: ${json.message || json.detail || ""}`;
      if (json.detail) {
        if (typeof json.detail === "string") return json.detail;
        return JSON.stringify(json.detail);
      }
    } catch {
      // not JSON
    }
    return null;
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  get isValidationError(): boolean {
    return this.statusCode === 422;
  }

  get isRateLimited(): boolean {
    return this.statusCode === 429;
  }

  get isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class TimeoutError extends Error {
  public readonly generationId: string;
  public readonly attempts: number;

  constructor(generationId: string, attempts: number) {
    super(`Generation ${generationId} did not complete after ${attempts} polling attempts`);
    this.name = "TimeoutError";
    this.generationId = generationId;
    this.attempts = attempts;
  }
}
