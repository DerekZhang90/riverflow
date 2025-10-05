import { NextResponse } from "next/server";
import { createNanoBananaTask } from "@/backend/utils/yunwu";
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
    num_images = 1,
    output_format = 'jpeg',
    aspect_ratio = '1:1',
    sync_mode = false,
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

  // 准备 Nano Banana API 请求参数
  const input = {
    prompt,
    num_images,
    output_format,
    aspect_ratio,
    sync_mode,
  };

  try {
    // 调用云雾 API 创建任务
    const response = await createNanoBananaTask(input);

    // 保存到数据库
    const resultId = genEffectResultId();
    await createEffectResult({
      result_id: resultId,
      user_id: user_id,
      original_id: response.request_id,
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

    // 返回包含 status_url 的响应
    return NextResponse.json({
      id: response.request_id,
      status: response.status,
      status_url: response.status_url,
      request_id: response.request_id,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Nano Banana text-to-image API error:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
