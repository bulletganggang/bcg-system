import { format } from "date-fns";

// 导出数据的类型定义
export interface ExportSheet {
  name: string;
  data: Record<string, any>[];
}

export interface ExportData {
  sheets: ExportSheet[];
}

interface AnalysisData {
  date: string;
  sleepScore: number;
  sleepStages: {
    lightSleep: number;
    deepSleep: number;
    remSleep: number;
  };
  sleepTime: string;
  wakeTime: string;
}

interface AnomalyStats {
  sleepQualityAnomalies: number;
  sleepDurationAnomalies: number;
  sleepPatternAnomalies: number;
}

/**
 * 获取导出文件的配置
 * @param analysisData 分析数据
 * @param anomalyStats 异常统计数据
 * @returns 导出数据配置
 */
export const getExportConfig = (
  analysisData: AnalysisData[],
  anomalyStats: AnomalyStats
): ExportData => {
  const totalAnomalies =
    anomalyStats.sleepQualityAnomalies +
    anomalyStats.sleepDurationAnomalies +
    anomalyStats.sleepPatternAnomalies;

  const totalChecks = analysisData.length * 3; // 每天三个检查项

  return {
    sheets: [
      {
        name: "睡眠数据",
        data: analysisData.map((item) => ({
          日期: item.date,
          睡眠评分: item.sleepScore,
          浅睡眠时长: `${item.sleepStages.lightSleep}分钟`,
          深睡眠时长: `${item.sleepStages.deepSleep}分钟`,
          REM睡眠时长: `${item.sleepStages.remSleep}分钟`,
          总睡眠时长: `${
            item.sleepStages.lightSleep +
            item.sleepStages.deepSleep +
            item.sleepStages.remSleep
          }分钟`,
          入睡时间: item.sleepTime,
          起床时间: item.wakeTime,
        })),
      },
      {
        name: "异常统计",
        data: [
          {
            指标: "睡眠质量异常",
            数值: anomalyStats.sleepQualityAnomalies,
          },
          {
            指标: "睡眠时长异常",
            数值: anomalyStats.sleepDurationAnomalies,
          },
          {
            指标: "睡眠规律异常",
            数值: anomalyStats.sleepPatternAnomalies,
          },
          {
            指标: "异常总数",
            数值: totalAnomalies,
          },
          {
            指标: "检查项总数",
            数值: totalChecks,
          },
          {
            指标: "异常率",
            数值: `${((totalAnomalies / totalChecks) * 100).toFixed(2)}%`,
          },
        ],
      },
    ],
  };
};

/**
 * 获取导出文件名
 * @param selectedDate 选择的日期
 * @param analysisType 分析类型（'weekly' | 'monthly'）
 * @returns 格式化的文件名前缀
 */
export const getExportFileName = (
  selectedDate: Date,
  analysisType: "weekly" | "monthly"
): string => {
  if (analysisType === "weekly") {
    // 获取所选周的起始日期
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return `睡眠分析报告_${format(startDate, "yyyy-MM-dd")} ~ ${format(
      endDate,
      "yyyy-MM-dd"
    )}`;
  } else {
    // 月度报告
    return `睡眠分析报告_${format(selectedDate, "yyyy-MM")}`;
  }
};
