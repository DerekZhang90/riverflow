import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { predictionId: string } }
) {
  if (!process.env.YUNWU_API_TOKEN) {
    throw new Error(
      "The YUNWU_API_TOKEN environment variable is not set. Please add it to your .env file."
    );
  }

  const { predictionId } = params;
  const YUNWU_API_BASE = "https://yunwu.ai";

  try {
    // 使用 Replicate 标准接口查询
    const response = await fetch(
      `${YUNWU_API_BASE}/replicate/v1/predictions/${predictionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YUNWU_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store', // 禁用缓存，确保获取最新数据
      }
    );

    if (!response.ok) {
      // 任务可能还在初始化，返回 processing 状态而不是报错
      console.log(`Seedream prediction not ready yet (${response.status}), returning processing status`);
      return NextResponse.json({
        id: predictionId,
        status: "processing",
        output: null,
      });
    }

    const data = await response.json();

    console.log("Seedream query response:", JSON.stringify(data, null, 2));

    // 直接返回 Replicate 格式数据
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching Seedream prediction:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to get prediction status" },
      { status: 500 }
    );
  }
}
