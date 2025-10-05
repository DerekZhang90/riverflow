import { NextResponse } from "next/server";
import { createSeedreamTask } from "@/backend/utils/yunwu";
import { createEffectResult } from "@/backend/service/effect_result";
import { genEffectResultId } from "@/backend/utils/genId";
import { generateCheck } from "@/backend/service/generate-_check";

export async function POST(request: Request) {
  if (!process.env.YUNWU_API_TOKEN) {
    throw new Error(
      "The YUNWU_API_TOKEN environment variable is not set. Please add it to your .env file."
    );
  }

  const requestBody = await request.json();
  const {
    prompt,
    size = '2K',
    aspect_ratio = '1:1',
    sequential_image_generation = 'disabled',
    max_images,
    user_id,
    user_email,
    effect_link_name,
    credit
  } = requestBody;

  // 检查用户积分
  const result = await generateCheck(user_id, user_email, credit);
  if (result !== 1) {
    return NextResponse.json(
      { detail: "Insufficient credits or user validation failed" },
      { status: 500 }
    );
  }

  // 准备 Seedream 4.0 API 请求参数
  const input: any = {
    prompt,
    size,
    aspect_ratio,
    sequential_image_generation,
  };

  // max_images 只在 auto 模式下添加（1-15）
  if (sequential_image_generation === 'auto' && max_images) {
    input.max_images = Math.min(Math.max(1, max_images), 15);
  }

  try {
    // 调用云雾 API 创建任务
    const prediction = await createSeedreamTask(input);

    if (prediction.error) {
      return NextResponse.json(
        { detail: prediction.error },
        { status: 500 }
      );
    }

    // 保存到数据库
    const resultId = genEffectResultId();
    await createEffectResult({
      result_id: resultId,
      user_id: user_id,
      original_id: prediction.id,
      effect_id: 0,
      effect_name: effect_link_name,
      prompt: prompt,
      url: "",
      status: "pending",
      original_url: "",
      storage_type: "yunwu",
      running_time: -1,
      credit: credit,
      request_params: JSON.stringify(requestBody),
      created_at: new Date()
    }).catch(error => {
      console.error("Failed to create effect result:", error);
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error: any) {
    console.error("Seedream text-to-image API error:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
