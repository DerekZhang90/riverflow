/**
 * Yunwu.ai API 工具函数
 * 统一的云雾API，支持 Seedream 和 Nano Banana
 */

const YUNWU_API_BASE = 'https://yunwu.ai';
const YUNWU_API_TOKEN = process.env.YUNWU_API_TOKEN;

// ==================== Seedream 4.0 (Replicate) ====================

export interface SeedreamInput {
  prompt: string;
  image?: string; // 图生图时使用，base64 或 URL
  size?: '0.25K' | '0.5K' | '1K' | '2K';
  aspect_ratio?: '1:1' | '4:3' | '3:2' | '16:9' | '21:9' | '3:4' | '2:3' | '9:16';
  sequential_image_generation?: 'enabled' | 'disabled';
  max_images?: number; // 1-6
}

export interface SeedreamResponse {
  id: string;
  model: string;
  version: string;
  input: SeedreamInput;
  logs: string;
  output: string[] | null;
  data_removed: boolean;
  error: any;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  urls: {
    cancel: string;
    get: string;
  };
}

/**
 * 创建 Seedream 4.0 文生图任务
 */
export async function createSeedreamTask(
  input: SeedreamInput
): Promise<SeedreamResponse> {
  if (!YUNWU_API_TOKEN) {
    throw new Error('YUNWU_API_TOKEN environment variable is not set');
  }

  const response = await fetch(
    `${YUNWU_API_BASE}/replicate/v1/models/bytedance/seedream-4/predictions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YUNWU_API_TOKEN}`,
      },
      body: JSON.stringify({ input }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yunwu.ai Seedream API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * 查询 Seedream 任务状态
 */
export async function getSeedreamTaskStatus(
  predictionId: string
): Promise<SeedreamResponse> {
  if (!YUNWU_API_TOKEN) {
    throw new Error('YUNWU_API_TOKEN environment variable is not set');
  }

  const response = await fetch(
    `${YUNWU_API_BASE}/replicate/v1/predictions/${predictionId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${YUNWU_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yunwu.ai Seedream API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ==================== Nano Banana (Fal.ai) ====================

export interface NanoBananaInput {
  prompt: string;
  image_urls?: string[];
  num_images?: number;
}

export interface NanoBananaResponse {
  status: string;
  request_id: string;
  response_url: string;
  status_url: string;
  cancel_url: string;
  logs: any;
  metrics: Record<string, any>;
  queue_position?: number;
}

export interface NanoBananaStatusResponse {
  status: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  error?: string;
}

/**
 * 创建 Nano Banana 文生图任务
 */
export async function createNanoBananaTask(
  input: NanoBananaInput
): Promise<NanoBananaResponse> {
  if (!YUNWU_API_TOKEN) {
    throw new Error('YUNWU_API_TOKEN environment variable is not set');
  }

  const response = await fetch(`${YUNWU_API_BASE}/fal-ai/nano-banana`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${YUNWU_API_TOKEN}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yunwu.ai Nano Banana API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * 创建 Nano Banana 图生图任务
 */
export async function createNanoBananaEditTask(
  input: NanoBananaInput
): Promise<NanoBananaResponse> {
  if (!YUNWU_API_TOKEN) {
    throw new Error('YUNWU_API_TOKEN environment variable is not set');
  }

  if (!input.image_urls || input.image_urls.length === 0) {
    throw new Error('image_urls is required for image-to-image task');
  }

  const response = await fetch(`${YUNWU_API_BASE}/fal-ai/nano-banana/edit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${YUNWU_API_TOKEN}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yunwu.ai Nano Banana Edit API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * 查询 Nano Banana 任务状态
 */
export async function getNanoBananaTaskStatus(
  statusUrl: string
): Promise<NanoBananaStatusResponse> {
  if (!YUNWU_API_TOKEN) {
    throw new Error('YUNWU_API_TOKEN environment variable is not set');
  }

  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${YUNWU_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Yunwu.ai Nano Banana status API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}
