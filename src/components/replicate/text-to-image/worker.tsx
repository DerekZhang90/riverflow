"use client";

import React, { useState, useEffect } from "react";
import { Button, Textarea, Select, SelectItem } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import CreditInfo from "@/components/landingpage/credit-info";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { useLocale } from "next-intl";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type AIModel = {
  id: string;
  name: string;
  api_endpoint?: string;
  link_name?: string;
  description: {
    en: string;
    zh: string;
  };
  supports_image_to_image: boolean;
  disabled?: boolean;
};

// AI 模型配置
const AI_MODELS: AIModel[] = [
  {
    id: "seedream-text",
    name: "Seedream V4",
    api_endpoint: "seedream-text-to-image",
    link_name: "seedream-text-to-image",
    description: {
      zh: "高质量图片生成，支持多种尺寸和分辨率",
      en: "High-fidelity generation with flexible resolutions and ratios.",
    },
    supports_image_to_image: true,
  },
  {
    id: "nanobanana",
    name: "Nano Banana",
    api_endpoint: "nanobanana-text-to-image",
    link_name: "nanobanana-text-to-image",
    description: {
      zh: "快速生成，适合快速原型和创意探索",
      en: "Lightning-fast renders ideal for rapid exploration and ideation.",
    },
    supports_image_to_image: true,
  },
  {
    id: "riverflow",
    name: "RiverFlow",
    description: {
      zh: "旗舰模型即将上线，提供更高画质与控制力",
      en: "Our flagship model is coming soon with higher fidelity and control.",
    },
    supports_image_to_image: false,
    disabled: true,
  },
];

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string | null;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
  lang?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultModel = AI_MODELS.find((model) => !model.disabled) || AI_MODELS[0];
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [generationMode, setGenerationMode] = useState<"text" | "image">("text");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Seedream 参数
  const [size, setSize] = useState<string>("2K");
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [sequentialGeneration, setSequentialGeneration] = useState<string>("disabled");
  const [maxImages, setMaxImages] = useState<number>(1);

  // Nano Banana 参数
  const [numImages, setNumImages] = useState<number>(1);
  const [outputFormat, setOutputFormat] = useState<string>("jpeg");
  const [nanoAspectRatio, setNanoAspectRatio] = useState<string>("1:1");

  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations(props.lang || "index");
  const locale = useLocale();
  const localeKey = locale === "zh" ? "zh" : "en";

  const ui = {
    en: {
      chooseModel: "Select an AI model",
      toastInsufficientCredits: (required: number, remain?: number) =>
        `Not enough credits. ${required} required, ${remain ?? 0} remaining.`,
      toastPromptRequired: "Please enter a prompt.",
      toastImageRequired: "Please upload a reference image.",
      toastComingSoon: "RiverFlow model is coming soon",
      comingSoonLabel: "Coming soon",
      creditsPill: "1 credit / image",
      generationMode: "Generation mode",
      textMode: "Text to image",
      imageMode: "Image to image",
      uploadLabel: "Upload reference image",
      uploadPlaceholder: "Tap to upload an image",
      resolutionLabel: "Resolution",
      resolutionPlaceholder: "Select resolution",
      aspectLabel: "Aspect ratio",
      aspectPlaceholder: "Select aspect ratio",
      aspectAutoHint: "Aspect ratio matches the uploaded image automatically",
      sequentialLabel: "Batch mode",
      sequentialPlaceholder: "Select mode",
      sequentialDisabled: "Off",
      sequentialAuto: "Auto (AI will decide to create related images)",
      maxImagesLabel: "Maximum images (1-15)",
      maxImagesHint: "Limit for auto mode when generating related shots",
      nanoCountLabel: "Images (1-4)",
      outputFormatLabel: "Output format",
      outputFormatPlaceholder: "Select format",
      nanoAspectLabel: "Aspect ratio",
      processing: "Processing...",
      generating: "Generating...",
      generateButton: (credits: number) => `Generate images (${credits} credits)`,
    },
    zh: {
      chooseModel: "选择 AI 模型",
      toastInsufficientCredits: (required: number, remain?: number) =>
        `积分不足，需要 ${required} 积分，当前剩余 ${remain ?? 0} 积分`,
      toastPromptRequired: "请输入提示词",
      toastImageRequired: "请上传参考图片",
      toastComingSoon: "RiverFlow 模型即将上线",
      comingSoonLabel: "即将推出",
      creditsPill: "1 积分/图",
      generationMode: "生成模式",
      textMode: "文生图",
      imageMode: "图生图",
      uploadLabel: "上传参考图片",
      uploadPlaceholder: "点击上传图片",
      resolutionLabel: "分辨率",
      resolutionPlaceholder: "选择分辨率",
      aspectLabel: "宽高比",
      aspectPlaceholder: "选择宽高比",
      aspectAutoHint: "宽高比：自动匹配输入图片",
      sequentialLabel: "组图生成模式",
      sequentialPlaceholder: "选择模式",
      sequentialDisabled: "关闭",
      sequentialAuto: "自动（AI决定是否生成多张关联图片）",
      maxImagesLabel: "最大生成数量 (1-15)",
      maxImagesHint: "AI 自动模式下的最大图片数量",
      nanoCountLabel: "生成数量 (1-4)",
      outputFormatLabel: "输出格式",
      outputFormatPlaceholder: "选择格式",
      nanoAspectLabel: "宽高比",
      processing: "处理中...",
      generating: "生成中...",
      generateButton: (credits: number) => `生成图片 (${credits} 积分)`,
    },
  } as const;

  const seedreamAspectOptions = localeKey === "en"
    ? [
        { key: "1:1", label: "1:1 (Square)" },
        { key: "4:3", label: "4:3 (Landscape)" },
        { key: "3:2", label: "3:2 (Landscape)" },
        { key: "16:9", label: "16:9 (Landscape)" },
        { key: "21:9", label: "21:9 (Ultrawide)" },
        { key: "3:4", label: "3:4 (Portrait)" },
        { key: "2:3", label: "2:3 (Portrait)" },
        { key: "9:16", label: "9:16 (Portrait)" },
      ]
    : [
        { key: "1:1", label: "1:1 (正方形)" },
        { key: "4:3", label: "4:3 (横版)" },
        { key: "3:2", label: "3:2 (横版)" },
        { key: "16:9", label: "16:9 (横版)" },
        { key: "21:9", label: "21:9 (超宽)" },
        { key: "3:4", label: "3:4 (竖版)" },
        { key: "2:3", label: "2:3 (竖版)" },
        { key: "9:16", label: "9:16 (竖版)" },
      ];

  const nanoAspectOptions = localeKey === "en"
    ? [
        { key: "1:1", label: "1:1 (Square)" },
        { key: "4:3", label: "4:3" },
        { key: "3:2", label: "3:2" },
        { key: "2:3", label: "2:3" },
        { key: "5:4", label: "5:4" },
        { key: "4:5", label: "4:5" },
        { key: "3:4", label: "3:4" },
        { key: "16:9", label: "16:9" },
        { key: "9:16", label: "9:16" },
        { key: "21:9", label: "21:9" },
      ]
    : [
        { key: "1:1", label: "1:1 (正方形)" },
        { key: "4:3", label: "4:3" },
        { key: "3:2", label: "3:2" },
        { key: "2:3", label: "2:3" },
        { key: "5:4", label: "5:4" },
        { key: "4:5", label: "4:5" },
        { key: "3:4", label: "3:4" },
        { key: "16:9", label: "16:9" },
        { key: "9:16", label: "9:16" },
        { key: "21:9", label: "21:9" },
      ];

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
    setIsSubscribed(userSubscriptionInfo.subscription_status === "active");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 计算所需积分: 1 积分 = 1 图
  const calculateRequiredCredits = () => {
    let credits = 1; // 默认单图
    if (selectedModel.id === "seedream-text" && sequentialGeneration === "auto") {
      credits = maxImages; // Seedream auto 模式按图片数计算
    } else if (selectedModel.id === "nanobanana") {
      credits = numImages; // Nano Banana 按图片数计算
    }
    return credits;
  };

  const handleGenerate = async () => {
    let newPrediction: Prediction;

    const requiredCredits = calculateRequiredCredits();

    // 检查积分是否足够
    if (
      typeof userSubscriptionInfo?.remain_count === "number" &&
      userSubscriptionInfo.remain_count < requiredCredits
    ) {
      toast.warning(
        ui[localeKey].toastInsufficientCredits(
          requiredCredits,
          userSubscriptionInfo.remain_count
        )
      );
      return;
    }

    if (prompt.length === 0) {
      toast.warning(ui[localeKey].toastPromptRequired);
      return;
    }

    if (generationMode === "image" && !uploadedImage) {
      toast.warning(ui[localeKey].toastImageRequired);
      return;
    }

    if (!selectedModel.api_endpoint || !selectedModel.link_name) {
      toast.info(
        localeKey === "en"
          ? "This model will be available soon. Please choose another model."
          : "该模型即将上线，请选择其他模型。"
      );
      return;
    }
    // step1: create prediction
    try {
      setGenerating(true);

      // 根据模型和模式选择 API 端点
      let apiEndpoint = "/api/predictions/";
      if (generationMode === "text") {
        apiEndpoint += selectedModel.api_endpoint;
      } else {
        // 图生图模式
        apiEndpoint += selectedModel.api_endpoint.replace("text-to-image", "image-to-image");
      }

      // 准备请求参数
      const requestBody: any = {
        prompt,
        user_id: user?.uuid,
        user_email: user?.email,
        effect_link_name: selectedModel.link_name,
        credit: requiredCredits, // 使用计算出的积分数
      };

      // 根据模型类型添加特定参数
      if (selectedModel.id === "seedream-text") {
        requestBody.size = size;
        requestBody.aspect_ratio = generationMode === "image" ? "match_input_image" : aspectRatio;
        requestBody.sequential_image_generation = sequentialGeneration;
        // max_images 仅在 auto 模式下生效
        if (sequentialGeneration === "auto") {
          requestBody.max_images = maxImages;
        }
      } else if (selectedModel.id === "nanobanana") {
        requestBody.num_images = numImages;
        requestBody.output_format = outputFormat;
        requestBody.aspect_ratio = nanoAspectRatio;
        requestBody.sync_mode = false;
      }

      // 图生图模式需要图片
      if (generationMode === "image" && uploadedImage) {
        if (selectedModel.id === "seedream-text") {
          requestBody.image_input = [uploadedImage]; // Seedream 使用 image_input 数组
        } else {
          requestBody.image_urls = [uploadedImage]; // Nano Banana 使用 image_urls 数组
        }
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      newPrediction = await response.json();

      // Yunwu API 返回格式兼容性处理
      if (newPrediction.request_id && !newPrediction.id) {
        newPrediction.id = newPrediction.request_id;
      }

      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred while generating the image.");
      setGenerating(false);
      return;
    }

    // step2: wait for prediction to be succeeded or failed
    // 根据模型类型选择查询端点
    const isSeedream = selectedModel.api_endpoint.includes("seedream");
    const isNanoBanana = selectedModel.api_endpoint.includes("nanobanana");

    const pollEndpoint = isSeedream
      ? `/api/predictions/seedream/${newPrediction.id}`
      : isNanoBanana
      ? `/api/predictions/nanobanana/${newPrediction.id}`
      : `/api/predictions/${newPrediction.id}`;

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(2000);
      const response = await fetch(pollEndpoint);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        setGenerating(false);
        return;
      }
      setPrediction(newPrediction);
    }
    // update effect result
    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;

    // Extract URLs from prediction output (could be single URL or array)
    let imageUrls: string | string[] = "";
    if (newPrediction.output) {
      if (Array.isArray(newPrediction.output)) {
        imageUrls = newPrediction.output; // Array of URLs
        console.log(`📸 Extracted ${newPrediction.output.length} image URLs for upload to R2`);
      } else {
        imageUrls = newPrediction.output; // Single URL
        console.log(`📸 Extracted single image URL for upload to R2:`, imageUrls);
      }
    }

    console.log(`🔄 Calling /api/effect_result/update with:`, {
      original_id: newPrediction.id,
      status: newPrediction.status,
      original_image_url: Array.isArray(imageUrls) ? `Array(${imageUrls.length})` : typeof imageUrls,
    });

    // 调用更新接口,触发R2上传
    await fetch("/api/effect_result/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: imageUrls,
        object_key: newPrediction.id.substring(0, 8),
      }),
    });

    console.log("⏳ R2 upload completed, fetching permanent URLs from database...");

    // 等待R2上传完成并从数据库读取永久链接
    try {
      const dbResponse = await fetch(`/api/effect_result/${newPrediction.id}`);
      if (dbResponse.ok) {
        const dbResult = await dbResponse.json();
        if (dbResult.url) {
          console.log("✅ Fetched R2 URLs from database:", dbResult.url);
          console.log("📊 Database URL type:", typeof dbResult.url);

          // 数据库的 url 字段可能是:
          // 1. 单图: "https://pub-xxx.r2.dev/..."
          // 2. 多图: '["https://...","https://..."]' (JSON字符串)

          let parsedUrls;
          if (typeof dbResult.url === "string") {
            try {
              // 尝试解析JSON数组
              parsedUrls = JSON.parse(dbResult.url);
              console.log("✅ Parsed as JSON array:", parsedUrls);
            } catch {
              // 不是JSON,直接作为单个URL
              parsedUrls = [dbResult.url];
              console.log("✅ Using as single URL:", parsedUrls);
            }
          } else {
            parsedUrls = dbResult.url;
          }

          // 更新 prediction.output 为解析后的数组
          newPrediction.output = parsedUrls;
          setPrediction({ ...newPrediction });
          console.log("🔄 Updated prediction.output to:", parsedUrls);
        }
      }
    } catch (error) {
      console.error("Failed to fetch R2 URLs from database:", error);
      // 如果获取失败,继续使用原始URL
    }

    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* 模型选择区域 */}
        <div className="mb-8 pt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {ui[localeKey].chooseModel}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {AI_MODELS.map((model) => (
              <div
                key={model.id}
                onClick={() => {
                  if (model.disabled) {
                    toast.info(ui[localeKey].toastComingSoon);
                    return;
                  }
                  setSelectedModel(model);
                }}
                className={`rounded-xl p-6 transition-all duration-300 ${
                  model.disabled
                    ? "cursor-not-allowed border-2 border-dashed border-[#2a2a2a] bg-[#141414] opacity-70"
                    : selectedModel.id === model.id
                    ? "cursor-pointer border-2 border-blue-500 bg-blue-600/20"
                    : "cursor-pointer border-2 border-[#2a2a2a] bg-[#1a1a1a] hover:border-blue-600/50"
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">{model.name}</h3>
                  {model.disabled ? (
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm text-yellow-300">
                      {ui[localeKey].comingSoonLabel}
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                      {ui[localeKey].creditsPill}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{model.description[localeKey]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 生成模式切换 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {ui[localeKey].generationMode}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setGenerationMode("text")}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                generationMode === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
            >
              <Icon icon="lucide:type" className="inline-block w-5 h-5 mr-2" />
              {ui[localeKey].textMode}
            </button>
            <button
              onClick={() => setGenerationMode("image")}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                generationMode === "image"
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
            >
              <Icon icon="lucide:image" className="inline-block w-5 h-5 mr-2" />
              {ui[localeKey].imageMode}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
            {/* 图生图：图片上传 */}
            {generationMode === "image" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {ui[localeKey].uploadLabel}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="block w-full h-48 border-2 border-dashed border-[#2a2a2a] rounded-xl cursor-pointer hover:border-blue-600/50 transition-all duration-300 overflow-hidden"
                  >
                    {uploadedImage ? (
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <Icon icon="lucide:upload" className="w-12 h-12 mb-2" />
                        <span>{ui[localeKey].uploadPlaceholder}</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {t("input.title")}
                </h2>
              <div className="flex items-center gap-3">
                <CreditInfo
                  credit={userSubscriptionInfo?.remain_count?.toString() || ""}
                />
              </div>
            </div>
            <label className="block ml-1 text-sm mb-2 text-gray-300">Prompt</label>
            <Textarea
              className="min-h-[40px]"
              minRows={5}
              placeholder={props.promptTips || "Enter a prompt here"}
              radius="lg"
              variant="bordered"
              classNames={{
                input: "bg-[#0a0a0a] text-white",
                inputWrapper: "bg-[#0a0a0a] border-[#2a2a2a]",
              }}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Prompt"
            />
          </div>

          {/* Seedream 专属参数 */}
          {selectedModel.id === "seedream-text" && (
            <>
              <div className="mb-6">
                <label className="block ml-1 text-sm mb-2 text-gray-300">
                  {ui[localeKey].resolutionLabel}
                </label>
                <Select
                  placeholder={ui[localeKey].resolutionPlaceholder}
                  className="max-w-xs"
                  selectedKeys={[size]}
                  onSelectionChange={(keys) => setSize(Array.from(keys)[0] as string)}
                  aria-label="Size"
                  classNames={{
                    trigger: "bg-[#0a0a0a] border-[#2a2a2a]",
                    value: "text-white",
                    popoverContent: "bg-[#1a1a1a] border border-[#2a2a2a]",
                    listbox: "bg-[#1a1a1a]",
                  }}
                >
                  <SelectItem key="1K" value="1K">1K (1024px)</SelectItem>
                  <SelectItem key="2K" value="2K">2K (2048px)</SelectItem>
                  <SelectItem key="4K" value="4K">4K (4096px)</SelectItem>
                </Select>
              </div>

              {/* 只在文生图模式显示宽高比选择 */}
              {generationMode === "text" && (
                <div className="mb-6">
                  <label className="block ml-1 text-sm mb-2 text-gray-300">
                    {ui[localeKey].aspectLabel}
                  </label>
                  <Select
                    placeholder={ui[localeKey].aspectPlaceholder}
                    className="max-w-xs"
                    selectedKeys={[aspectRatio]}
                    onSelectionChange={(keys) => setAspectRatio(Array.from(keys)[0] as string)}
                    aria-label="Aspect Ratio"
                    classNames={{
                      trigger: "bg-[#0a0a0a] border-[#2a2a2a]",
                      value: "text-white",
                      popoverContent: "bg-[#1a1a1a] border border-[#2a2a2a]",
                      listbox: "bg-[#1a1a1a]",
                    }}
                  >
                    {seedreamAspectOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}

              {/* 图生图模式提示 */}
              {generationMode === "image" && (
                <div className="mb-6">
                  <p className="text-sm text-gray-400">
                    {ui[localeKey].aspectAutoHint}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <label className="block ml-1 text-sm mb-2 text-gray-300">
                  {ui[localeKey].sequentialLabel}
                </label>
                <Select
                  placeholder={ui[localeKey].sequentialPlaceholder}
                  className="max-w-xs"
                  selectedKeys={[sequentialGeneration]}
                  onSelectionChange={(keys) => setSequentialGeneration(Array.from(keys)[0] as string)}
                  aria-label="Sequential Generation"
                  classNames={{
                    trigger: "bg-[#0a0a0a] border-[#2a2a2a]",
                    value: "text-white",
                    popoverContent: "bg-[#1a1a1a] border border-[#2a2a2a]",
                    listbox: "bg-[#1a1a1a]",
                  }}
                >
                  <SelectItem key="disabled" value="disabled">
                    {ui[localeKey].sequentialDisabled}
                  </SelectItem>
                  <SelectItem key="auto" value="auto">
                    {ui[localeKey].sequentialAuto}
                  </SelectItem>
                </Select>
              </div>

              {/* max_images 只在 auto 模式下显示 */}
              {sequentialGeneration === "auto" && (
                <div className="mb-6">
                  <label className="block ml-1 text-sm mb-2 text-gray-300">
                    {ui[localeKey].maxImagesLabel}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={maxImages}
                    onChange={(e) => setMaxImages(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {ui[localeKey].maxImagesHint}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Nano Banana 参数 */}
          {selectedModel.id === "nanobanana" && (
            <>
              <div className="mb-6">
                <label className="block ml-1 text-sm mb-2 text-gray-300">
                  {ui[localeKey].nanoCountLabel}
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={numImages}
                  onChange={(e) => setNumImages(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block ml-1 text-sm mb-2 text-gray-300">
                  {ui[localeKey].outputFormatLabel}
                </label>
                <Select
                  placeholder={ui[localeKey].outputFormatPlaceholder}
                  className="max-w-xs"
                  selectedKeys={[outputFormat]}
                  onSelectionChange={(keys) => setOutputFormat(Array.from(keys)[0] as string)}
                  aria-label="Output Format"
                  classNames={{
                    trigger: "bg-[#0a0a0a] border-[#2a2a2a]",
                    value: "text-white",
                    popoverContent: "bg-[#1a1a1a] border border-[#2a2a2a]",
                    listbox: "bg-[#1a1a1a]",
                  }}
                >
                  <SelectItem key="jpeg" value="jpeg">JPEG</SelectItem>
                  <SelectItem key="png" value="png">PNG</SelectItem>
                </Select>
              </div>

              <div className="mb-6">
                <label className="block ml-1 text-sm mb-2 text-gray-300">
                  {ui[localeKey].nanoAspectLabel}
                </label>
                <Select
                  placeholder={ui[localeKey].aspectPlaceholder}
                  className="max-w-xs"
                  selectedKeys={[nanoAspectRatio]}
                  onSelectionChange={(keys) => setNanoAspectRatio(Array.from(keys)[0] as string)}
                  aria-label="Nano Aspect Ratio"
                  classNames={{
                    trigger: "bg-[#0a0a0a] border-[#2a2a2a]",
                    value: "text-white",
                    popoverContent: "bg-[#1a1a1a] border border-[#2a2a2a]",
                    listbox: "bg-[#1a1a1a]",
                  }}
                >
                  {nanoAspectOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </>
          )}

          {generating ? (
            <Button
              isLoading
              className="w-full mt-4 bg-blue-600 text-white transition duration-200"
            >
              {prediction
                ? prediction.status === "succeeded"
                  ? ui[localeKey].processing
                  : prediction.status
                : ui[localeKey].generating}
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              onClick={handleGenerate}
            >
              <Icon icon="lucide:sparkles" className="w-5 h-5 mr-2" />
              {ui[localeKey].generateButton(calculateRequiredCredits())}
            </Button>
          )}
        </div>

        <Output
          error={error || ""}
          prediction={prediction}
          defaultImage={props.defaultImage || ""}
          showImage={null}
        />
      </div>
      </div>
    </>
  );
}
