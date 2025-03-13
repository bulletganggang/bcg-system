import type { ComparisonData } from "@/types";

/**
 * 获取睡眠时长对比图表配置
 */
export const getDurationComparisonOption = (
  comparisonData: ComparisonData[]
) => {
  if (comparisonData.length !== 2) return {};

  const data = comparisonData.map((item) => ({
    date: item.date,
    duration: item.data.sleep_summary_data.total_sleep_duration_minutes,
  }));

  return {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c}分钟",
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
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "睡眠时长(分钟)",
    },
    series: [
      {
        type: "bar",
        data: data.map((item) => ({
          value: item.duration,
          itemStyle: {
            color: "#1890ff",
          },
        })),
        label: {
          show: true,
          position: "top",
          formatter: "{c}分钟",
        },
      },
    ],
  };
};
