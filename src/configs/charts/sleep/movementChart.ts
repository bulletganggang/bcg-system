import type { SleepData } from "@/types";

/**
 * 获取体动数据图表配置
 * @param sleepData 睡眠数据
 * @returns ECharts配置项
 */
export const getMovementChartOption = (sleepData: SleepData) => {
  const { movement } = sleepData;

  // 找出身体变动和体位改变的时长
  const bodyMovementDuration =
    movement.movement_types.find((item) => item.type === "Body Movement")
      ?.duration_minutes || 0;

  const positionChangeDuration =
    movement.movement_types.find((item) => item.type === "Position Change")
      ?.duration_minutes || 0;

  // 准备数据
  const data = [
    {
      name: "不活跃总时长",
      value: movement.total_inactivity_duration_minutes,
      itemStyle: { color: "#b39ddb" }, // 紫色
    },
    {
      name: "体动总时长",
      value: movement.total_movement_duration_minutes,
      itemStyle: { color: "#ffb74d" }, // 橙色
    },
    {
      name: "体位改变时长",
      value: positionChangeDuration,
      itemStyle: { color: "#4fc3f7" }, // 青色
    },
    {
      name: "身体变动时长",
      value: bodyMovementDuration,
      itemStyle: { color: "#ef5350" }, // 红色
    },
  ];

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: "{b}: {c}分钟",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "分钟",
      axisLabel: {
        formatter: "{value}",
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
        },
      },
    },
    yAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: "体动数据",
        type: "bar",
        data: data,
        label: {
          show: true,
          position: "right",
          formatter: "{c}",
        },
        barWidth: "40%",
      },
    ],
  };
};
