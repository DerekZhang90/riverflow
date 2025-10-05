import { Button } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Output({
  error,
  prediction,
  defaultImage,
  showImage,
}: {
  error: string;
  prediction: any;
  defaultImage: string;
  showImage: string | null;
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 获取所有图片 URL
  const getImageUrls = (): string[] => {
    if (showImage) return [showImage];
    if (!prediction?.output) return [];

    // 处理数组格式
    if (Array.isArray(prediction.output)) {
      return prediction.output;
    }

    // 处理JSON字符串格式(从数据库加载的R2 URLs)
    if (typeof prediction.output === "string") {
      try {
        const parsed = JSON.parse(prediction.output);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Not JSON, treat as single URL
      }
      return [prediction.output];
    }

    return [];
  };

  const imageUrls = getImageUrls();

  const downloadImage = (url: string, index?: number) => {
    const link = document.createElement("a");
    link.href = url;
    const filename = index !== undefined
      ? `ai-generated-image-${index + 1}.png`
      : "ai-generated-image.png";
    link.setAttribute("download", filename);
    link.setAttribute("target", "_blank");
    link.click();
  };

  const downloadAllImages = () => {
    imageUrls.forEach((url, index) => {
      setTimeout(() => downloadImage(url, index), index * 500);
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">生成结果</h2>
        {imageUrls.length > 1 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Icon icon="lucide:images" className="w-4 h-4" />
            <span>{imageUrls.length} 张图片</span>
          </div>
        )}
      </div>

      {error && error !== "" && (
        <div className="flex items-center justify-center p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
          <Icon icon="lucide:alert-circle" className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-400">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-center min-h-[500px]">
        {prediction ? (
          <>
            {imageUrls.length > 0 ? (
              <div className="w-full">
                {/* 网格布局显示多张图片 */}
                <div className={`grid gap-4 ${
                  imageUrls.length === 1 ? 'grid-cols-1' :
                  imageUrls.length === 2 ? 'grid-cols-2' :
                  imageUrls.length <= 4 ? 'grid-cols-2' :
                  imageUrls.length <= 6 ? 'grid-cols-3' :
                  'grid-cols-4'
                }`}>
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden bg-[#0a0a0a] cursor-pointer"
                      onClick={() => setSelectedImage(url)}
                    >
                      <img
                        src={url}
                        alt={`Generated Result ${index + 1}`}
                        className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadImage(url, index);
                          }}
                          startContent={<Icon icon="lucide:download" className="w-4 h-4" />}
                        >
                          下载
                        </Button>
                      </div>
                      {/* 图片序号标签 */}
                      {imageUrls.length > 1 && (
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 底部操作栏 */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon icon="lucide:check-circle" className="w-4 h-4 text-green-400" />
                    <span>生成完成</span>
                  </div>
                  {imageUrls.length > 1 && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={downloadAllImages}
                      startContent={<Icon icon="lucide:download" className="w-4 h-4" />}
                    >
                      下载全部 ({imageUrls.length})
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[500px] bg-[#0a0a0a] border-2 border-dashed border-[#2a2a2a] rounded-xl">
                <CircularProgress
                  size="lg"
                  color="primary"
                  aria-label="Generating..."
                  classNames={{
                    svg: "w-16 h-16",
                    indicator: "stroke-blue-500",
                    track: "stroke-[#2a2a2a]",
                  }}
                />
                <span className="text-white font-medium mt-4 capitalize">
                  {prediction.status === "starting" ? "准备中..." :
                   prediction.status === "processing" ? "生成中..." :
                   prediction.status}
                </span>
                <span className="text-gray-500 text-sm mt-2">
                  这可能需要 10-30 秒，请耐心等待
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-[500px] border-2 border-dashed border-[#2a2a2a] rounded-xl">
            {defaultImage ? (
              <img
                src={defaultImage}
                alt="Preview"
                className="max-w-full max-h-[450px] rounded-lg opacity-50"
              />
            ) : (
              <div className="text-center">
                <Icon icon="lucide:image" className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">输入参数后点击生成</p>
                <p className="text-gray-600 text-sm mt-2">生成的图片将显示在这里</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 大图预览模态框 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              isIconOnly
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              <Icon icon="lucide:x" className="w-6 h-6 text-white" />
            </Button>
            <Button
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                downloadImage(selectedImage);
              }}
              startContent={<Icon icon="lucide:download" className="w-5 h-5" />}
            >
              下载图片
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
