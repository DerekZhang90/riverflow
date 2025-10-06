"use client";
import { useAppContext } from "@/contexts/app";
import { useEffect, useState } from "react";
import { EffectResultInfo } from "@/backend/type/domain/effect_result_info";
import {
  Pagination,
  Modal,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  ModalContent,
  ModalBody,
  Link,
} from "@nextui-org/react";
import { EyeIcon } from "@nextui-org/shared-icons";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
export default function Dashboard() {
  const { user } = useAppContext();
  const [effectResults, setEffectResults] = useState<EffectResultInfo[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedResult, setSelectedResult] = useState<EffectResultInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboard");
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
  };

  const fetchResults = async (pageNum: number) => {
    if (!user?.uuid) return;

    setIsLoading(true);
    try {
      const results = await fetch(
        `/api/effect_result/list_by_user_id?user_id=${user.uuid}&page=${pageNum}&page_size=${pageSize}`
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch results");
        return res.json();
      });
      setEffectResults(results);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCount = async () => {
    if (!user?.uuid) return;

    try {
      const response = await fetch(
        `/api/effect_result/count_all?user_id=${user.uuid}`
      );
      if (!response.ok) throw new Error("Failed to fetch count");

      const data = await response.json();
      const count = parseInt(data.count);
      setTotalCount(count);
      const pages = Math.max(1, Math.ceil(count / pageSize));
      setTotalPages(pages);

      if (page > pages) {
        setPage(1);
      }
    } catch (error) {
      console.error("Failed to fetch count:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      fetchUserSubscriptionInfo();
      await fetchCount();
      await fetchResults(page);
    };

    if (user?.uuid) {
      init();
    }
  }, [user?.uuid]);

  useEffect(() => {
    if (user?.uuid) {
      fetchResults(page);
      fetchUserSubscriptionInfo();
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  const parseUrlField = (value: unknown): string[] => {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseUrlField(parsed);
        } catch {
          return [trimmed];
        }
      }
      return [trimmed];
    }

    if (typeof value === "object" && value !== null) {
      const maybeUrl = (value as { url?: unknown }).url;
      if (maybeUrl) return parseUrlField(maybeUrl);
    }

    return [];
  };

  const handleViewResult = async (result: EffectResultInfo) => {
    setSelectedResult(result);
    setIsModalOpen(true);
    setPreviewError(null);

    const fallbackUrls = parseUrlField(result.url);
    setPreviewUrls(fallbackUrls);

    if (!result.original_id) {
      return;
    }

    setIsPreviewLoading(true);

    try {
      const response = await fetch(
        `/api/effect_result/${encodeURIComponent(result.original_id)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch result detail: ${response.status}`);
      }

      const detail = await response.json();
      const resolved = parseUrlField(detail.url);

      if (resolved.length > 0) {
        setPreviewUrls(resolved);
      } else if (fallbackUrls.length === 0 && detail.original_image_url) {
        const originalUrls = parseUrlField(detail.original_image_url);
        setPreviewUrls(originalUrls);
      }
    } catch (error) {
      console.error("Failed to fetch result detail:", error);
      if (fallbackUrls.length === 0) {
        setPreviewError(
          locale === "zh"
            ? "暂时无法加载结果，请稍后再试"
            : "We could not load this output. Please try again later."
        );
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderMedia = (urls: string[]) => {
    if (!urls.length) return null;

    const videoExtensions = [".mp4", ".webm", ".mov", ".m4v"];

    return urls.map((url, index) => {
      const lower = url.toLowerCase();
      const isVideo = videoExtensions.some((ext) => lower.endsWith(ext));

      if (isVideo) {
        return (
          <video
            key={`${url}-${index}`}
            src={url}
            controls
            className="w-full rounded-xl border border-white/10"
          />
        );
      }

      return (
        <img
          key={`${url}-${index}`}
          src={url}
          alt="Generated result"
          className="w-full rounded-xl border border-white/10 object-contain"
          loading="lazy"
        />
      );
    });
  };

  const isUrlLike = (value?: string) => {
    if (!value) return false;
    return /^https?:\/\//i.test(value.trim());
  };

  return (
    <div className="">
      <div className="container max-w-7xl mx-auto px-4 md:p-8 py-10 md:py-12 md:pb-24">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2">
            {t("title")}
          </h1>
        </div>

        {userSubscriptionInfo && (
          <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.remainingCredits")}
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.remain_count}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.planName")}
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.plan_name}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.periodStart")}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {new Date(
                      userSubscriptionInfo.current_period_start
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-blue-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("subscription.periodEnd")}
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {userSubscriptionInfo.current_period_end
                      ? new Date(
                          userSubscriptionInfo.current_period_end
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 rounded-2xl">
            <Spinner size="lg" label={t("loading")} color="primary" />
          </div>
        ) : effectResults && effectResults.length > 0 ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-700 p-6 animate-fade-in overflow-x-auto">
              <Table
                className="min-w-full"
                aria-label="Results table"
                classNames={{
                  wrapper: "bg-transparent",
                  th: "bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
                  td: "text-gray-700 dark:text-gray-300",
                }}
              >
                <TableHeader>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    #
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.function")}
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.processTime")}
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.status")}
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.credit")}
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.created")}
                  </TableColumn>
                  <TableColumn className="text-xs md:text-sm font-semibold text-center">
                    {t("table.view")}
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {effectResults.map((result, index) => (
                    <TableRow
                      key={result.result_id}
                      className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <TableCell className="text-center text-xs md:text-base font-medium">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="text-center text-xs md:text-base">
                        {result.effect_name}
                      </TableCell>
                      <TableCell className="text-center text-xs md:text-base">
                        {result.running_time === -1
                          ? "N/A"
                          : `${result.running_time}s`}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          {result.status === "succeeded" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              ✓ {result.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              ✗ {result.status}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs md:text-base">
                        {result.status === "succeeded" ? result.credit : "N/A"}
                      </TableCell>
                      <TableCell className="text-center text-xs md:text-base">
                        {new Date(result.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          isIconOnly
                          className="bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-gray-600 transition-colors"
                          variant="flat"
                          onPress={() => handleViewResult(result)}
                          isDisabled={
                            !result.url || result.status !== "succeeded"
                          }
                          size="sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalCount > 0 && (
              <div className="flex justify-center mt-6 md:mt-8">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  showControls
                  className="gap-1 md:gap-2"
                  size="md"
                  color="primary"
                  variant="flat"
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 bg-blue-50 dark:bg-gray-800 rounded-2xl border border-blue-100 dark:border-gray-700">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              {t("noResults")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {locale === "zh"
                ? "开始创建精彩的 AI 内容吧！"
                : "Start a new AI generation to fill this space."}
            </p>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedResult(null);
            setPreviewUrls([]);
            setPreviewError(null);
          }}
          size="2xl"
          className="mx-2"
          backdrop="blur"
        >
          <ModalContent className="bg-white dark:bg-gray-800">
            {selectedResult && (
              <ModalBody>
                <div className="p-2 md:p-4">
                  {isPreviewLoading ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                      <Spinner color="primary" label={t("loading")} />
                    </div>
                  ) : previewUrls.length > 0 ? (
                    <div className="space-y-4">
                      {renderMedia(previewUrls)}
                    </div>
                  ) : previewError ? (
                    <div className="text-center p-4 text-sm text-gray-400">
                      {previewError}
                    </div>
                  ) : selectedResult?.url && !isUrlLike(selectedResult.url) ? (
                    <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-left text-sm text-slate-200">
                      {selectedResult.url}
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-gray-500 mb-2">
                        {t("modal.noContent")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("modal.effect")}: {selectedResult.effect_name} |{" "}
                        {t("modal.status")}: {selectedResult.status}
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
