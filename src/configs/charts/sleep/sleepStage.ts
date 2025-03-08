import dayjs from "dayjs";
import type { SleepData } from "@/types";

// 睡眠阶段映射
const stageMap = {
  "Light Sleep": 1,
  "Deep Sleep": 2,
  "REM Sleep": 3,
} as const;

// 睡眠阶段名称映射
const stageNameMap = {
  "Light Sleep": "浅睡",
  "Deep Sleep": "深睡",
  "REM Sleep": "REM",
} as const;

/**
 * 获取睡眠阶段图表配置
 */
export const getSleepStageOption = (sleepData: SleepData) => {
  const { sleep_stages } = sleepData;

  const data = sleep_stages.map((stage) => ({
    name: dayjs(stage.timestamp * 1000).format("HH:mm"),
    value: stageMap[stage.stage],
    stage: stageNameMap[stage.stage],
  }));

  return {
    title: {
      text: "睡眠阶段变化",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        const item = params[0];
        return `${item.name} ${item.data.stage}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLabel: {
        interval: Math.floor(data.length / 10),
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      splitLine: { show: false },
      axisLabel: {
        formatter: function (value: number) {
          const stageNames = ["", "浅睡", "深睡", "REM"];
          return stageNames[value] || "";
        },
      },
    },
    series: [
      {
        name: "睡眠阶段",
        type: "line",
        step: "start",
        data: data,
      },
    ],
  };
};
