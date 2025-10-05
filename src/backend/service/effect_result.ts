import { toEffectResultInfo } from "../type/domain/effect_result_info";
import { EffectResult } from "../type/type";
import {
  countByUserId,
  create,
  getByOriginalId,
  getByResultIdAndUserId,
  pageListByUserId,
} from "../models/effect_result";
import { toEffectResultInfos } from "../type/domain/effect_result_info";
import { update } from "../models/effect_result";
import { uploadImageToR2, uploadVideoToR2, uploadMultipleImagesToR2 } from "../lib/r2";

export async function createEffectResult(effectResult: EffectResult) {
  const result = await create(effectResult);
  return result;
}

export async function updateEffectResult(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  r2Url: string | string[]
) {
  console.log(
    `updateEffectResult called with originalId: ${originalId}, status: ${status}, r2Url:`,
    r2Url
  );

  let finalUrl: string = "";

  if (r2Url && r2Url !== "" && r2Url !== null && r2Url !== undefined) {
    try {
      // Handle array of URLs (multiple images)
      if (Array.isArray(r2Url)) {
        console.log(`Uploading ${r2Url.length} images to R2`);
        const uploadedUrls = await uploadMultipleImagesToR2(r2Url, originalId);
        console.log(`Successfully uploaded ${uploadedUrls.length} images to R2`);
        // Store as JSON array string in database
        finalUrl = JSON.stringify(uploadedUrls);
      }
      // Handle single URL
      else if (typeof r2Url === "string") {
        if (r2Url.endsWith(".mp4") || r2Url.includes("video")) {
          console.log(`Uploading video to R2: ${r2Url}`);
          finalUrl = await uploadVideoToR2(r2Url, originalId);
          console.log(`Video uploaded successfully, new URL: ${finalUrl}`);
        } else {
          console.log(`Uploading image to R2: ${r2Url}`);
          finalUrl = await uploadImageToR2(r2Url, originalId);
          console.log(`Image uploaded successfully, new URL: ${finalUrl}`);
        }
      }
    } catch (error) {
      console.error(`Failed to upload to R2:`, error);
      // If upload fails, use original URL
      finalUrl = Array.isArray(r2Url) ? JSON.stringify(r2Url) : r2Url;
    }
  }

  await update(originalId, status, runningTime, updatedAt, finalUrl);
  console.log(`Effect result updated in database with URL: ${finalUrl}`);
}

export async function updateEffectResultError(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  url: string
) {
  await update(originalId, status, runningTime, updatedAt, url);
}

export async function updateEffectResultText(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  text: string
) {
  await update(originalId, status, runningTime, updatedAt, text);
}

export async function getEffectResult(resultId: string, userId: string) {
  const result = await getByResultIdAndUserId(resultId, userId);
  return toEffectResultInfo(result);
}

export async function pageListEffectResultsByUserId(
  userId: string,
  page: number,
  pageSize: number
) {
  const results = await pageListByUserId(userId, page, pageSize);
  return toEffectResultInfos(results);
}

export async function getEffectResultByOriginalId(originalId: string) {
  const result = await getByOriginalId(originalId);
  if (!result) {
    return null;
  }
  return toEffectResultInfo(result);
}

export async function countEffectResultsByUserId(userId: string) {
  const count = await countByUserId(userId);
  return count;
}
