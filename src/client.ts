import fs from "node:fs";
import path from "node:path";
import { APIError, TimeoutError } from "./errors";
import type {
  BalanceResponse,
  ClientOptions,
  GenerateAdCopyRequest,
  GenerateDialogueRequest,
  GenerateMediaRequest,
  GenerateMusicRequest,
  GenerateResponse,
  GenerationStatus,
  GenerationsListParams,
  ModelsResponse,
  UploadResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://api.kubeez.com";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const LIB_VERSION = "2.0.3";

export class AIImageClient {
  private apiKey: string;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.defaultHeaders = {
      "User-Agent": `ai-image-cli/${LIB_VERSION}`,
      "X-Client": "ai-image-cli",
      "X-Client-Version": LIB_VERSION,
      ...(options.headers || {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retries = MAX_RETRIES): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      "X-API-Key": this.apiKey,
      ...(options.headers as Record<string, string>),
    };

    if (options.body && typeof options.body === "string") {
      headers["Content-Type"] = "application/json";
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
          const errorBody = await response.text();
          const error = new APIError(response.status, errorBody);

          // Only retry on server errors or rate limits
          if ((error.isServerError || error.isRateLimited) && attempt < retries) {
            const delay = RETRY_DELAY_MS * 2 ** attempt;
            await new Promise((resolve) => setTimeout(resolve, delay));
            lastError = error;
            continue;
          }

          throw error;
        }

        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof APIError) throw error;
        lastError = error as Error;
        if (attempt < retries) {
          const delay = RETRY_DELAY_MS * 2 ** attempt;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }

  async getModels(modelType?: string): Promise<ModelsResponse> {
    const params = modelType ? `?model_type=${encodeURIComponent(modelType)}` : "";
    return this.request<ModelsResponse>(`/v1/models${params}`);
  }

  async generateMedia(req: GenerateMediaRequest): Promise<GenerateResponse> {
    return this.request<GenerateResponse>("/v1/generate/media", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getMediaStatus(id: string): Promise<GenerationStatus> {
    return this.request<GenerationStatus>(`/v1/generate/media/${encodeURIComponent(id)}`);
  }

  async uploadMedia(filePath: string, bucket?: string): Promise<UploadResponse> {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const formData = new FormData();
    formData.append("file", new Blob([fileBuffer]), fileName);

    const params = bucket ? `?bucket=${encodeURIComponent(bucket)}` : "";
    return this.request<UploadResponse>(`/v1/upload/media${params}`, {
      method: "POST",
      body: formData,
    });
  }

  async generateMusic(req: GenerateMusicRequest): Promise<GenerateResponse> {
    return this.request<GenerateResponse>("/v1/generate/music", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getMusicStatus(id: string): Promise<GenerationStatus> {
    return this.request<GenerationStatus>(`/v1/generate/music/${encodeURIComponent(id)}`);
  }

  async generateDialogue(req: GenerateDialogueRequest): Promise<GenerateResponse> {
    return this.request<GenerateResponse>("/v1/generate/dialogue", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async generateAdCopy(req: GenerateAdCopyRequest): Promise<GenerateResponse> {
    return this.request<GenerateResponse>("/v1/generate/ad-copy", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>("/v1/balance");
  }

  async getGenerations(params?: GenerationsListParams): Promise<unknown> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.model) searchParams.set("model", params.model);
    if (params?.generation_type) searchParams.set("generation_type", params.generation_type);
    const qs = searchParams.toString();
    return this.request(`/v1/generations${qs ? `?${qs}` : ""}`);
  }

  async healthCheck(): Promise<unknown> {
    return this.request("/health");
  }

  async pollForCompletion(
    id: string,
    type: "media" | "music" = "media",
    intervalMs = 3000,
    maxAttempts = 200,
  ): Promise<GenerationStatus> {
    const statusFn = type === "media" ? this.getMediaStatus.bind(this) : this.getMusicStatus.bind(this);

    for (let i = 0; i < maxAttempts; i++) {
      const status = await statusFn(id);
      if (status.status === "completed" || status.status === "failed" || status.status === "error") {
        return status;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new TimeoutError(id, maxAttempts);
  }
}
