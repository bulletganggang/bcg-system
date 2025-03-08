import type { SleepData } from "@/types";

/**
 * 获取睡眠时长分布图表配置
 */
export const getSleepSummaryOption = (sleepData: SleepData) => {
  const { sleep_summary_data } = sleepData;
  const data = [
    { value: sleep_summary_data.light_sleep_overall_minutes, name: "浅睡" },
    { value: sleep_summary_data.deep_sleep_overall_minutes, name: "深睡" },
    { value: sleep_summary_data.rem_sleep_overall_minutes, name: "REM" },
  ];

  return {
    title: {
      text: "睡眠时长分布",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}分钟 ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["浅睡", "深睡", "REM"],
    },
    series: [
      {
        name: "睡眠时长",
        type: "pie",
        radius: "50%",
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
};
