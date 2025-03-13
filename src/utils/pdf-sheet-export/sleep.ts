import dayjs from "dayjs";
import type { SleepData } from "@/types";
import type { ExportData } from "./types";

/**
 * 获取睡眠质量等级信息
 */
const getQualityLevel = (score: number) => {
  if (score >= 90) {
    return {
      level: "优秀",
      description: "睡眠质量非常好，请继续保持良好的睡眠习惯。",
    };
  }
  if (score >= 80) {
    return {
      level: "良好",
      description: "睡眠质量良好，但仍有提升的空间。",
    };
  }
  if (score >= 70) {
    return {
      level: "一般",
      description: "睡眠质量一般，建议关注相关建议来改善睡眠。",
    };
  }
  return {
    level: "欠佳",
    description: "睡眠质量较差，请认真关注相关建议并及时改善。",
  };
};

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

  // 呼吸率数据（包含异常检测）
  const respiratoryRateData = [
    {
      类型: "数据指标",
      指标: "最低呼吸率",
      数值: `${sleepData.respiratory_rate.minimum_bpm}次/分钟`,
      状态:
        sleepData.respiratory_rate.minimum_bpm < 10
          ? "严重偏低"
          : sleepData.respiratory_rate.minimum_bpm < 12
          ? "偏低"
          : "正常",
    },
    {
      类型: "数据指标",
      指标: "平均呼吸率",
      数值: `${sleepData.respiratory_rate.average_bpm}次/分钟`,
      状态:
        sleepData.respiratory_rate.average_bpm < 10
          ? "严重偏低"
          : sleepData.respiratory_rate.average_bpm > 24
          ? "严重偏高"
          : sleepData.respiratory_rate.average_bpm < 12 ||
            sleepData.respiratory_rate.average_bpm > 20
          ? "偏高"
          : "正常",
    },
    {
      类型: "数据指标",
      指标: "最高呼吸率",
      数值: `${sleepData.respiratory_rate.maximum_bpm}次/分钟`,
      状态:
        sleepData.respiratory_rate.maximum_bpm > 24
          ? "严重偏高"
          : sleepData.respiratory_rate.maximum_bpm > 20
          ? "偏高"
          : "正常",
    },
    {
      类型: "参考标准",
      指标: "正常范围",
      数值: "12-20次/分钟",
      状态: "-",
    },
  ];

  // 体动监测数据
  const movementData = [
    {
      指标: "不活跃总时长",
      数值: `${sleepData.movement.total_inactivity_duration_minutes}分钟`,
    },
    {
      指标: "体动总时长",
      数值: `${sleepData.movement.total_movement_duration_minutes}分钟`,
    },
    {
      指标: "体位改变时长",
      数值: `${
        sleepData.movement.movement_types.find(
          (item) => item.type === "Position Change"
        )?.duration_minutes || 0
      }分钟`,
    },
    {
      指标: "身体变动时长",
      数值: `${
        sleepData.movement.movement_types.find(
          (item) => item.type === "Body Movement"
        )?.duration_minutes || 0
      }分钟`,
    },
  ];

  // 睡眠质量评估（包含建议）
  const qualityLevel = getQualityLevel(sleepData.sleep_quality_score);
  const sleepQualityData = [
    {
      类型: "评估结果",
      指标: "睡眠评分",
      数值: sleepData.sleep_quality_score,
      评估: `${qualityLevel.level}（${qualityLevel.description}）`,
    },
    ...sleepData.sleep_suggestion.map((suggestion, index) => ({
      类型: "改善建议",
      指标: `建议${index + 1}`,
      数值: suggestion,
      评估: "-",
    })),
  ];

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
        name: "呼吸率分析",
        data: respiratoryRateData,
      },
      {
        name: "体动监测",
        data: movementData,
      },
      {
        name: "睡眠质量评估",
        data: sleepQualityData,
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
