import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { AIImageClient } from "../src/client";

const TEST_API_KEY = "sk_test_1234567890";
const BASE_URL = "https://api.kubeez.com";

function mockFetchResponse(data: unknown, status = 200) {
  return mock(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    }),
  );
}

describe("AIImageClient", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should create client with api key", () => {
    const client = new AIImageClient({ apiKey: TEST_API_KEY });
    expect(client).toBeDefined();
  });

  it("should create client with custom base url", () => {
    const client = new AIImageClient({ apiKey: TEST_API_KEY, baseUrl: "https://custom.api.com" });
    expect(client).toBeDefined();
  });

  it("should send default headers (User-Agent, X-Client)", async () => {
    const mockData = { models: [] };
    globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

    const client = new AIImageClient({ apiKey: TEST_API_KEY });
    await client.getModels();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          "User-Agent": expect.stringContaining("ai-image-cli/"),
          "X-Client": "ai-image-cli",
          "X-Client-Version": expect.any(String),
        }),
      }),
    );
  });

  it("should merge custom headers from constructor", async () => {
    const mockData = { models: [] };
    globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

    const client = new AIImageClient({
      apiKey: TEST_API_KEY,
      headers: { "X-Custom": "my-app", "X-Request-Id": "abc-123" },
    });
    await client.getModels();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Custom": "my-app",
          "X-Request-Id": "abc-123",
          "X-API-Key": TEST_API_KEY,
        }),
      }),
    );
  });

  describe("getModels", () => {
    it("should fetch models without filter", async () => {
      const mockData = { models: [{ model_id: "model-1", display_name: "Test Model", model_type: "image" }] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getModels();

      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/models`,
        expect.objectContaining({
          headers: expect.objectContaining({ "X-API-Key": TEST_API_KEY }),
        }),
      );
    });

    it("should fetch models with type filter", async () => {
      const mockData = { models: [] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      await client.getModels("image");

      expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/v1/models?model_type=image`, expect.anything());
    });
  });

  describe("generateMedia", () => {
    it("should send generate media request", async () => {
      const mockData = { generation_id: "gen-123", status: "pending" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.generateMedia({
        prompt: "a beautiful sunset",
        model: "flux-schnell",
      });

      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${BASE_URL}/v1/generate/media`,
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  describe("getMediaStatus", () => {
    it("should fetch media generation status", async () => {
      const mockData = { id: "gen-123", status: "completed", outputs: [{ url: "https://example.com/image.png" }] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getMediaStatus("gen-123");

      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(`${BASE_URL}/v1/generate/media/gen-123`, expect.anything());
    });
  });

  describe("generateMusic", () => {
    it("should send generate music request", async () => {
      const mockData = { generation_id: "music-123", status: "pending" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.generateMusic({
        prompt: "upbeat electronic track",
        instrumental: true,
        model: "V5",
      });

      expect(result).toEqual(mockData);
    });
  });

  describe("getMusicStatus", () => {
    it("should fetch music generation status", async () => {
      const mockData = { id: "music-123", status: "completed" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getMusicStatus("music-123");

      expect(result).toEqual(mockData);
    });
  });

  describe("generateDialogue", () => {
    it("should send dialogue generation request", async () => {
      const mockData = { generation_id: "dial-123", status: "pending" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.generateDialogue({
        dialogue: [
          { text: "Hello there!", voice: "Adam" },
          { text: "Hi! How are you?", voice: "Emily" },
        ],
      });

      expect(result).toEqual(mockData);
    });
  });

  describe("generateAdCopy", () => {
    it("should send ad copy generation request", async () => {
      const mockData = { generation_id: "ad-123", status: "pending" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.generateAdCopy({
        reference_ad_url: "https://example.com/ad.png",
        language: "en",
        variant_count: 2,
      });

      expect(result).toEqual(mockData);
    });
  });

  describe("getBalance", () => {
    it("should fetch account balance", async () => {
      const mockData = { credits: 100, message: "You have 100 credits.", purchase_url: "https://kubeez.com" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getBalance();

      expect(result).toEqual(mockData);
      expect(result.credits).toBe(100);
    });
  });

  describe("getGenerations", () => {
    it("should fetch generations without filters", async () => {
      const mockData = { generations: [] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getGenerations();

      expect(result).toEqual(mockData);
    });

    it("should fetch generations with filters", async () => {
      const mockData = { generations: [] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      await client.getGenerations({ status: "completed", model: "flux-schnell" });

      expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining("status=completed"), expect.anything());
    });
  });

  describe("healthCheck", () => {
    it("should check API health", async () => {
      const mockData = { status: "ok" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.healthCheck();

      expect(result).toEqual(mockData);
    });
  });

  describe("error handling", () => {
    it("should throw APIError on 401", async () => {
      globalThis.fetch = mockFetchResponse({ detail: "Unauthorized" }, 401) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: "bad-key" });
      expect(client.getModels()).rejects.toThrow();
    });

    it("should throw APIError on 422 validation error", async () => {
      globalThis.fetch = mockFetchResponse({ detail: "Validation failed" }, 422) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      expect(client.generateMedia({ prompt: "", model: "" })).rejects.toThrow();
    });
  });

  describe("retry logic", () => {
    it("should retry on 500 and eventually succeed", async () => {
      let callCount = 0;
      globalThis.fetch = mock(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({ detail: "Server error" }),
            text: () => Promise.resolve('{"detail":"Server error"}'),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ models: [] }),
          text: () => Promise.resolve('{"models":[]}'),
        });
      }) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getModels();

      expect(result).toEqual({ models: [] });
      expect(callCount).toBe(2);
    });

    it("should retry on 429 rate limit and eventually succeed", async () => {
      let callCount = 0;
      globalThis.fetch = mock(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 429,
            json: () => Promise.resolve({ detail: "Rate limited" }),
            text: () => Promise.resolve('{"detail":"Rate limited"}'),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ models: [] }),
          text: () => Promise.resolve('{"models":[]}'),
        });
      }) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getModels();

      expect(result).toEqual({ models: [] });
      expect(callCount).toBe(2);
    });

    it("should throw immediately on 401 without retrying", async () => {
      let callCount = 0;
      globalThis.fetch = mock(() => {
        callCount++;
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ detail: "Unauthorized" }),
          text: () => Promise.resolve('{"detail":"Unauthorized"}'),
        });
      }) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: "bad-key" });
      await expect(client.getModels()).rejects.toThrow();
      expect(callCount).toBe(1);
    });

    it("should retry on network error (TypeError) and eventually succeed", async () => {
      let callCount = 0;
      globalThis.fetch = mock(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new TypeError("Failed to fetch"));
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ models: [] }),
          text: () => Promise.resolve('{"models":[]}'),
        });
      }) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.getModels();

      expect(result).toEqual({ models: [] });
      expect(callCount).toBe(2);
    });
  });

  describe("pollForCompletion", () => {
    it("should return immediately if already completed", async () => {
      const mockData = { id: "gen-123", status: "completed", outputs: [{ url: "https://example.com/image.png" }] };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.pollForCompletion("gen-123", "media", 10, 3);

      expect(result).toEqual(mockData);
    });

    it("should return on failed status", async () => {
      const mockData = { id: "gen-123", status: "failed", error_message: "Model error" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.pollForCompletion("gen-123", "media", 10, 3);

      expect(result.status).toBe("failed");
    });

    it("should poll for music status", async () => {
      const mockData = { id: "music-123", status: "completed" };
      globalThis.fetch = mockFetchResponse(mockData) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.pollForCompletion("music-123", "music", 10, 3);

      expect(result.status).toBe("completed");
    });
  });

  describe("pollForCompletion transitions", () => {
    it("should poll through pending -> processing -> completed", async () => {
      let callCount = 0;
      const responses = [
        { id: "gen-456", status: "pending" },
        { id: "gen-456", status: "processing" },
        { id: "gen-456", status: "completed", outputs: [{ url: "https://example.com/done.png" }] },
      ];
      globalThis.fetch = mock(() => {
        const data = responses[callCount] || responses[responses.length - 1];
        callCount++;
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(data),
          text: () => Promise.resolve(JSON.stringify(data)),
        });
      }) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      const result = await client.pollForCompletion("gen-456", "media", 10, 10);

      expect(result.status).toBe("completed");
      expect(callCount).toBe(3);
    });

    it("should throw TimeoutError when maxAttempts exceeded", async () => {
      const pendingData = { id: "gen-timeout", status: "pending" };
      globalThis.fetch = mock(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(pendingData),
          text: () => Promise.resolve(JSON.stringify(pendingData)),
        }),
      ) as unknown as typeof fetch;

      const client = new AIImageClient({ apiKey: TEST_API_KEY });
      await expect(client.pollForCompletion("gen-timeout", "media", 10, 2)).rejects.toThrow("did not complete");
    });
  });
});
