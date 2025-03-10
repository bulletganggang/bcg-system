import dayjs from "dayjs";
import { AnalysisData, ReportType } from "../../types/analysis";
import { getSleepAdvice } from "../../configs/charts/analysis/sleepAdvice";
import { getSleepRegularityStats } from "../../configs/charts/analysis/sleepRegularity";

/**
 * 导出表格接口
 */
export interface ExportSheet {
  name: string;
  data: Record<string, any>[];
}

/**
 * 导出数据接口
 */
export interface ExportData {
  sheets: ExportSheet[];
}

/**
 * 安全获取时间戳格式化字符串
 * @param timestamp 时间戳（秒）
 * @param format 格式化字符串
 * @param defaultValue 默认值
 * @returns 格式化后的字符串
 */
const safeFormatTime = (
  timestamp: number | undefined | null,
  format: string,
  defaultValue: string = "无数据"
): string => {
  if (!timestamp || isNaN(timestamp)) return defaultValue;
  try {
    return dayjs(timestamp * 1000).format(format);
  } catch (error) {
    console.error("时间格式化错误:", error);
    return defaultValue;
  }
};

/**
 * 安全计算分钟数
 * @param seconds 秒数
 * @param defaultValue 默认值
 * @returns 分钟数字符串
 */
const safeCalculateMinutes = (
  seconds: number | undefined | null,
  defaultValue: string = "0分钟"
): string => {
  if (!seconds || isNaN(seconds)) return defaultValue;
  try {
    return `${Math.round(seconds / 60)}分钟`;
  } catch (error) {
    console.error("分钟计算错误:", error);
    return defaultValue;
  }
};

/**
 * 获取导出配置
 * @param analysisData 分析数据
 * @param reportType 报告类型
 * @param dateRange 日期范围
 * @returns 导出配置
 */
export const getExportConfig = (
  analysisData: AnalysisData | null,
  reportType: ReportType,
  dateRange: [string, string]
): ExportData => {
  if (!analysisData) {
    return { sheets: [] };
  }

  const [startDate, endDate] = dateRange;
  const dateRangeText = `${startDate} 至 ${endDate}`;

  // 睡眠评分数据
  const sleepScoreData =
    analysisData.sleep_score_list?.map((score, index) => {
      const timestamp = analysisData.timestamp_list?.[index] || 0;
      return {
        日期: safeFormatTime(timestamp, "YYYY-MM-DD"),
        睡眠评分: score || 0,
      };
    }) || [];

  // 睡眠阶段数据
  const sleepStageData =
    analysisData.sleep_stage_time_list?.map((stage, index) => {
      const timestamp = analysisData.timestamp_list?.[index] || 0;
      const lightSleep = stage?.light_sleep_overall_minutes || 0;
      const deepSleep = stage?.deep_sleep_overall_minutes || 0;
      const remSleep = stage?.rem_sleep_overall_minutes || 0;
      const totalSleep = lightSleep + deepSleep + remSleep;

      return {
        日期: safeFormatTime(timestamp, "YYYY-MM-DD"),
        浅睡眠时长: `${lightSleep}分钟`,
        深睡眠时长: `${deepSleep}分钟`,
        REM睡眠时长: `${remSleep}分钟`,
        总睡眠时长: `${totalSleep}分钟`,
      };
    }) || [];

  // 睡眠时间分布数据
  const sleepTimeData: Record<string, any>[] = [];

  // 安全地处理睡眠时间分布数据
  if (
    analysisData.sleep_time_distribute_list &&
    analysisData.sleep_time_distribute_list.length > 0
  ) {
    for (const [
      startTime,
      endTime,
    ] of analysisData.sleep_time_distribute_list) {
      if (startTime && endTime) {
        const sleepDuration = endTime > startTime ? endTime - startTime : 0;

        sleepTimeData.push({
          日期: safeFormatTime(startTime, "YYYY-MM-DD"),
          入睡时间: safeFormatTime(startTime, "HH:mm"),
          起床时间: safeFormatTime(endTime, "HH:mm"),
          睡眠时长: safeCalculateMinutes(sleepDuration),
        });
      }
    }
  }

  // 统计数据
  const statsData = [
    {
      指标: "平均睡眠评分",
      数值: analysisData.avg_sleep_score || 0,
    },
    {
      指标: "最高睡眠评分",
      数值: analysisData.max_sleep_score || 0,
    },
    {
      指标: "最低睡眠评分",
      数值: analysisData.min_sleep_score || 0,
    },
    {
      指标: "平均睡眠时长",
      数值: `${analysisData.avg_sleep_duration_time || 0}分钟`,
    },
    {
      指标: "最长睡眠时长",
      数值: `${analysisData.max_sleep_duration_time || 0}分钟`,
    },
    {
      指标: "最短睡眠时长",
      数值: `${analysisData.min_sleep_duration_time || 0}分钟`,
    },
    {
      指标: "平均入睡时间",
      数值: analysisData.avg_start_sleep_time || "无数据",
    },
    {
      指标: "最早入睡时间",
      数值: analysisData.earliest_sleep_time || "无数据",
    },
    {
      指标: "平均起床时间",
      数值: analysisData.avg_wakeUp_time || "无数据",
    },
    {
      指标: "最晚起床时间",
      数值: analysisData.latest_wakeUp_time || "无数据",
    },
  ];

  // 设备信息
  const deviceInfo = {
    分析周期: dateRangeText,
    设备类型: analysisData.device_type || "未知",
    设备编码: analysisData.device_code || "未知",
    报告类型: reportType === "weekly" ? "周报" : "月报",
    生成时间: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };

  // 个性化睡眠建议数据
  const sleepAdviceData = getSleepAdvice(analysisData).map((advice, index) => {
    return {
      序号: index + 1,
      建议类型: (() => {
        switch (advice.type) {
          case "success":
            return "优秀";
          case "info":
            return "提示";
          case "warning":
            return "警告";
          case "error":
            return "严重";
          default:
            return "提示";
        }
      })(),
      建议标题: advice.title,
      建议内容: advice.content,
    };
  });

  // 睡眠规律性分析数据
  const regularityStats = getSleepRegularityStats(analysisData);
  const sleepRegularityData = regularityStats.regularity
    ? [
        {
          指标: "入睡时间规律性",
          数值: regularityStats.regularity.sleepRegularityLevel,
          标准差: `${regularityStats.regularity.sleepTimeSD.toFixed(2)}小时`,
        },
        {
          指标: "起床时间规律性",
          数值: regularityStats.regularity.wakeUpRegularityLevel,
          标准差: `${regularityStats.regularity.wakeUpTimeSD.toFixed(2)}小时`,
        },
        {
          指标: "社交时差",
          数值: `${regularityStats.regularity.socialJetLag.toFixed(1)}小时`,
          说明: "工作日和周末起床时间的差异",
        },
      ]
    : [{ 提示: "暂无睡眠规律性数据" }];

  // 工作日与周末睡眠对比数据
  const workdayWeekendData = regularityStats.regularity
    ? [
        {
          类型: "工作日",
          平均入睡时间: regularityStats.series[0].data[0]
            ? formatHoursToTime(regularityStats.series[0].data[0] as number)
            : "无数据",
          平均起床时间: regularityStats.series[1].data[0]
            ? formatHoursToTime(regularityStats.series[1].data[0] as number)
            : "无数据",
        },
        {
          类型: "周末",
          平均入睡时间: regularityStats.series[0].data[1]
            ? formatHoursToTime(regularityStats.series[0].data[1] as number)
            : "无数据",
          平均起床时间: regularityStats.series[1].data[1]
            ? formatHoursToTime(regularityStats.series[1].data[1] as number)
            : "无数据",
        },
      ]
    : [{ 提示: "暂无工作日与周末睡眠对比数据" }];

  return {
    sheets: [
      {
        name: `睡眠数据分析(${reportType === "weekly" ? "周报" : "月报"})`,
        data: [deviceInfo],
      },
      {
        name: "睡眠评分",
        data:
          sleepScoreData.length > 0
            ? sleepScoreData
            : [{ 提示: "暂无睡眠评分数据" }],
      },
      {
        name: "睡眠阶段",
        data:
          sleepStageData.length > 0
            ? sleepStageData
            : [{ 提示: "暂无睡眠阶段数据" }],
      },
      {
        name: "睡眠时间",
        data:
          sleepTimeData.length > 0
            ? sleepTimeData
            : [{ 提示: "暂无睡眠时间数据" }],
      },
      {
        name: "统计数据",
        data: statsData,
      },
      {
        name: "个性化睡眠建议",
        data:
          sleepAdviceData.length > 0
            ? sleepAdviceData
            : [{ 提示: "暂无睡眠建议数据" }],
      },
      {
        name: "睡眠规律性分析",
        data: sleepRegularityData,
      },
      {
        name: "工作日与周末对比",
        data: workdayWeekendData,
      },
    ],
  };
};

/**
 * 获取导出文件名
 * @param selectedDate 选择的日期
 * @param reportType 报告类型
 * @returns 文件名
 */
export const getExportFileName = (
  selectedDate: dayjs.Dayjs,
  reportType: ReportType
): string => {
  if (!selectedDate || !selectedDate.isValid()) {
    return `睡眠数据分析_${dayjs().format("YYYY-MM-DD")}`;
  }

  try {
    const dateFormat = reportType === "weekly" ? "YYYY-[W]ww" : "YYYY-MM";
    return `睡眠数据分析_${selectedDate.format(dateFormat)}`;
  } catch (error) {
    console.error("文件名生成错误:", error);
    return `睡眠数据分析_${dayjs().format("YYYY-MM-DD")}`;
  }
};

/**
 * 格式化小时数为时间字符串
 * @param hours 小时数（带小数点）
 * @returns 格式化后的时间字符串 (HH:mm)
 */
const formatHoursToTime = (hours: number): string => {
  const adjustedHours = hours >= 24 ? hours - 24 : hours;
  const hoursPart = Math.floor(adjustedHours);
  const minutesPart = Math.round((adjustedHours - hoursPart) * 60);
  return `${String(hoursPart).padStart(2, "0")}:${String(minutesPart).padStart(
    2,
    "0"
  )}`;
};
