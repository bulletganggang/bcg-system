import dayjs from "dayjs";
import type { SleepData } from "@/types";
import type { ExportData } from "./types";

/**
 * 准备睡眠数据导出配置
 * @param sleepData 睡眠数据
 * @returns 导出配置
 */
export const prepareExportData = (
  sleepData: SleepData | null
): ExportData | undefined => {
  if (!sleepData) return undefined;

  // 睡眠阶段数据
  const sleepStageData = sleepData.sleep_stages.map((stage) => ({
    时间: dayjs(stage.timestamp * 1000).format("HH:mm"),
    阶段:
      stage.stage === "Light Sleep"
        ? "浅睡眠"
        : stage.stage === "Deep Sleep"
        ? "深睡眠"
        : "REM睡眠",
  }));

  // 睡眠概览数据
  const sleepSummaryData = [
    {
      指标: "睡眠评分",
      数值: sleepData.sleep_quality_score,
    },
    {
      指标: "入睡时间",
      数值: dayjs(sleepData.sleep_start_time * 1000).format("YYYY-MM-DD HH:mm"),
    },
    {
      指标: "醒来时间",
      数值: dayjs(sleepData.sleep_end_time * 1000).format("YYYY-MM-DD HH:mm"),
    },
    {
      指标: "总睡眠时长",
      数值: `${Math.floor(
        sleepData.sleep_summary_data.total_sleep_duration_minutes / 60
      )}小时${
        sleepData.sleep_summary_data.total_sleep_duration_minutes % 60
      }分钟`,
    },
    {
      指标: "浅睡眠时长",
      数值: `${sleepData.sleep_summary_data.light_sleep_overall_minutes}分钟`,
    },
    {
      指标: "深睡眠时长",
      数值: `${sleepData.sleep_summary_data.deep_sleep_overall_minutes}分钟`,
    },
    {
      指标: "REM睡眠时长",
      数值: `${sleepData.sleep_summary_data.rem_sleep_overall_minutes}分钟`,
    },
    {
      指标: "清醒次数",
      数值: `${sleepData.sleep_summary_data.awake_time}次`,
    },
  ];

  // 呼吸率数据
  const respiratoryRateData = [
    {
      指标: "最低呼吸率",
      数值: `${sleepData.respiratory_rate.minimum_bpm}次/分钟`,
    },
    {
      指标: "平均呼吸率",
      数值: `${sleepData.respiratory_rate.average_bpm}次/分钟`,
    },
    {
      指标: "最高呼吸率",
      数值: `${sleepData.respiratory_rate.maximum_bpm}次/分钟`,
    },
  ];

  // 睡眠建议数据
  const sleepSuggestionData = sleepData.sleep_suggestion.map(
    (suggestion, index) => ({
      序号: index + 1,
      建议内容: suggestion,
    })
  );

  return {
    sheets: [
      {
        name: "睡眠概览",
        data: sleepSummaryData,
      },
      {
        name: "睡眠阶段",
        data: sleepStageData,
      },
      {
        name: "呼吸率数据",
        data: respiratoryRateData,
      },
      {
        name: "睡眠建议",
        data: sleepSuggestionData,
      },
    ],
  };
};

/**
 * 获取导出文件名
 * @param date 日期
 * @returns 文件名
 */
export const getExportFileName = (date: dayjs.Dayjs): string => {
  return `睡眠数据_${date.format("YYYY-MM-DD")}`;
};
