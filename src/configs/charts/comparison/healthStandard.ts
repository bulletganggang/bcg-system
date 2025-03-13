import type { ComparisonData } from "@/types";

/**
 * 获取健康标准对比图表配置
 */
export const getHealthStandardOption = (comparisonData: ComparisonData[]) => {
  if (comparisonData.length !== 2) return {};

  const standardData = {
    sleepDuration: {
      min: 420, // 7小时
      max: 540, // 9小时
      unit: "分钟",
    },
    deepSleepRatio: {
      min: 0.15, // 15%
      max: 0.25, // 25%
      unit: "%",
    },
    remSleepRatio: {
      min: 0.2, // 20%
      max: 0.25, // 25%
      unit: "%",
    },
  };

  const indicators = [
    { name: "睡眠时长", max: 600 },
    { name: "深睡比例", max: 30 }, // 调整最大值以更好地显示比例
    { name: "REM比例", max: 30 }, // 调整最大值以更好地显示比例
    { name: "睡眠评分", max: 100 },
  ];

  const data = comparisonData.map((item) => {
    const totalDuration =
      item.data.sleep_summary_data.total_sleep_duration_minutes;
    const deepSleepRatio =
      (item.data.sleep_summary_data.deep_sleep_overall_minutes /
        totalDuration) *
      100;
    const remSleepRatio =
      (item.data.sleep_summary_data.rem_sleep_overall_minutes / totalDuration) *
      100;

    return {
      name: item.date,
      value: [
        totalDuration,
        deepSleepRatio,
        remSleepRatio,
        item.data.sleep_quality_score,
      ],
    };
  });

  // 添加健康标准范围
  const standardRange = {
    name: "健康标准范围",
    value: [
      (standardData.sleepDuration.min + standardData.sleepDuration.max) / 2, // 睡眠时长中位值
      20, // 深睡眠比例中位值 (15%-25%的中间值)
      22.5, // REM比例中位值 (20%-25%的中间值)
      85, // 睡眠评分基准线
    ],
    itemStyle: {
      color: "rgba(82, 196, 26, 0.3)",
    },
    areaStyle: {
      color: "rgba(82, 196, 26, 0.1)",
    },
    symbol: "none",
  };

  return {
    title: {
      text: "与健康标准对比",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (!params.value) return "";
        const indicators = ["睡眠时长", "深睡比例", "REM比例", "睡眠评分"];
        const units = ["分钟", "%", "%", "分"];
        let result = `${params.name}<br/>`;
        if (params.name === "健康标准范围") {
          result += `睡眠时长: ${standardData.sleepDuration.min}-${standardData.sleepDuration.max}分钟<br/>`;
          result += `深睡比例: ${standardData.deepSleepRatio.min * 100}-${
            standardData.deepSleepRatio.max * 100
          }%<br/>`;
          result += `REM比例: ${standardData.remSleepRatio.min * 100}-${
            standardData.remSleepRatio.max * 100
          }%<br/>`;
          result += `睡眠评分: ≥85分`;
        } else {
          params.value.forEach((val: number, index: number) => {
            result += `${indicators[index]}: ${val.toFixed(1)}${
              units[index]
            }<br/>`;
          });
        }
        return result;
      },
    },
    legend: {
      data: [...comparisonData.map((item) => item.date), "健康标准范围"],
      top: 30,
    },
    radar: {
      indicator: indicators,
      splitArea: {
        show: true,
        areaStyle: {
          color: ["#f6f8fc"],
        },
      },
    },
    series: [
      {
        type: "radar",
        data: [...data, standardRange],
      },
    ],
  };
};
