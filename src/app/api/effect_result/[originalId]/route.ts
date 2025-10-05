import { getEffectResultByOriginalId } from "@/backend/service/effect_result";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { originalId: string } }
) {
  try {
    const { originalId } = params;

    if (!originalId) {
      return NextResponse.json(
        { error: "originalId is required" },
        { status: 400 }
      );
    }

    const result = await getEffectResultByOriginalId(originalId);

    if (!result) {
      return NextResponse.json(
        { error: "Effect result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching effect result:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
