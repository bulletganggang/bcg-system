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
    lineStyle: {
      type: "dashed",
    },
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
