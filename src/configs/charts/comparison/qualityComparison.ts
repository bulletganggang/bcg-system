import type { ComparisonData } from "@/types";

/**
 * 获取睡眠质量对比图表配置
 */
export const getQualityComparisonOption = (
  comparisonData: ComparisonData[]
) => {
  if (comparisonData.length !== 2) return {};

  const data = comparisonData.map((item) => ({
    date: item.date,
    score: item.data.sleep_quality_score,
  }));

  return {
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c}分",
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
      name: "睡眠评分",
      min: 0,
      max: 100,
    },
    series: [
      {
        type: "bar",
        data: data.map((item) => ({
          value: item.score,
          itemStyle: {
            color: item.score >= 80 ? "#52c41a" : "#faad14",
          },
        })),
        label: {
          show: true,
          position: "top",
          formatter: "{c}分",
        },
      },
    ],
  };
};
