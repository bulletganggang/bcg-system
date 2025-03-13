import type { ComparisonData } from "@/types";

/**
 * 获取睡眠阶段对比图表配置
 */
export const getStageComparisonOption = (comparisonData: ComparisonData[]) => {
  if (comparisonData.length !== 2) return {};

  const data = comparisonData.map((item) => ({
    date: item.date,
    light: item.data.sleep_summary_data.light_sleep_overall_minutes,
    deep: item.data.sleep_summary_data.deep_sleep_overall_minutes,
    rem: item.data.sleep_summary_data.rem_sleep_overall_minutes,
  }));

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["浅睡", "深睡", "REM"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.date),
    },
    yAxis: {
      type: "value",
      name: "时长(分钟)",
    },
    series: [
      {
        name: "浅睡",
        type: "bar",
        stack: "total",
        data: data.map((item) => item.light),
        itemStyle: {
          color: "#91d5ff",
        },
      },
      {
        name: "深睡",
        type: "bar",
        stack: "total",
        data: data.map((item) => item.deep),
        itemStyle: {
          color: "#1890ff",
        },
      },
      {
        name: "REM",
        type: "bar",
        stack: "total",
        data: data.map((item) => item.rem),
        itemStyle: {
          color: "#0050b3",
        },
      },
    ],
  };
};
