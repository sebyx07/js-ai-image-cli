export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface Model {
  model_id: string;
  display_name: string;
  model_type: string;
  provider: string;
  cost_per_generation: number;
  estimated_time_seconds: number;
  capabilities: Record<string, unknown>;
  requires_input_media: boolean;
  input_media_types: string[];
  generation_types: string[];
  usage_notes?: string;
  [key: string]: unknown;
}

export interface ModelsResponse {
  models: Model[];
}

export interface GenerateMediaRequest {
  prompt: string;
  model: string;
  generation_type?: string;
  negative_prompt?: string;
  source_media_urls?: string[] | null;
  aspect_ratio?: string;
  duration?: string;
  quality?: string | null;
  seed?: number;
  sound?: boolean;
  fixed_lens?: boolean;
}

export interface GenerateMusicRequest {
  prompt: string;
  instrumental?: boolean;
  model?: string;
}

export interface DialogueLine {
  text: string;
  voice?: string;
}

export interface GenerateDialogueRequest {
  dialogue: DialogueLine[];
  stability?: number;
  language_code?: string;
}

export interface GenerateAdCopyRequest {
  reference_ad_url: string;
  product_image_url?: string;
  product_text?: string;
  language?: string;
  variant_count?: number;
  aspect_ratio?: string;
}

export interface GenerationOutput {
  id: string;
  media_type: string;
  url: string;
  thumbnail_url?: string;
  optimized_url?: string;
  width?: number;
  height?: number;
  duration?: number | null;
  format?: string | null;
  file_size?: number;
}

export interface GenerationStatus {
  id: string;
  status: string;
  model?: string;
  prompt?: string;
  generation_type?: string;
  created_at?: string;
  completed_at?: string | null;
  processing_time_ms?: number | null;
  credits_deducted?: number;
  error_message?: string | null;
  outputs?: GenerationOutput[];
  result_url?: string;
  [key: string]: unknown;
}

export interface GenerateResponse {
  generation_id: string;
  status: string;
  model: string;
  estimated_cost_credits: number;
  billing_mode: string;
  message: string;
  [key: string]: unknown;
}

export interface BalanceResponse {
  credits: number;
  message: string;
  purchase_url: string;
  [key: string]: unknown;
}

export interface UploadResponse {
  url: string;
  [key: string]: unknown;
}

export interface GenerationsListParams {
  status?: string;
  model?: string;
  generation_type?: string;
}

export interface GenerationsListResponse {
  generations: GenerationStatus[];
}
