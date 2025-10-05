import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  if (!process.env.YUNWU_API_TOKEN) {
    throw new Error(
      "The YUNWU_API_TOKEN environment variable is not set. Please add it to your .env file."
    );
  }

  const { requestId } = params;
  const YUNWU_API_BASE = "https://yunwu.ai";

  try {
    // 按照文档使用 Fal.ai 查询接口
    const response = await fetch(
      `${YUNWU_API_BASE}/fal-ai/nano-banana/requests/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YUNWU_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      // 任务可能还在初始化，返回 processing 状态而不是报错
      console.log(`Nano Banana request not ready yet (${response.status}), returning processing status`);
      return NextResponse.json({
        id: requestId,
        status: "processing",
        output: null,
      });
    }

    const data = await response.json();

    console.log("Nano Banana query response:", JSON.stringify(data, null, 2));

    // 转换为统一格式
    let status = "processing";
    let output = null;

    // 按照文档，完成状态有 images 字段
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      status = "succeeded";
      output = data.images.map((img: any) => img.url);
    }

    const prediction = {
      id: requestId,
      status: status,
      output: output,
      error: null,
    };

    console.log("Converted Nano Banana prediction:", JSON.stringify(prediction, null, 2));

    return NextResponse.json(prediction);
  } catch (error: any) {
    console.error("Error fetching Nano Banana request:", error);
    return NextResponse.json(
      { detail: error.message || "Failed to get request status" },
      { status: 500 }
    );
  }
}
