import type { ComparisonData } from "@/types";

/**
 * 获取体动数据对比图表配置
 */
export const getMovementComparisonOption = (
  comparisonData: ComparisonData[]
) => {
  if (comparisonData.length !== 2) return {};

  const [data1, data2] = comparisonData;

  // 提取体动数据
  const getMovementData = (data: ComparisonData) => {
    const bodyMovementDuration =
      data.data.movement.movement_types.find(
        (type) => type.type === "Body Movement"
      )?.duration_minutes || 0;
    const positionChangeDuration =
      data.data.movement.movement_types.find(
        (type) => type.type === "Position Change"
      )?.duration_minutes || 0;

    return {
      inactivity: data.data.movement.total_inactivity_duration_minutes,
      totalMovement: data.data.movement.total_movement_duration_minutes,
      bodyMovement: bodyMovementDuration,
      positionChange: positionChangeDuration,
    };
  };

  const movementData1 = getMovementData(data1);
  const movementData2 = getMovementData(data2);

  // 定义图表数据
  const categories = [
    "不活跃总时长",
    "体动总时长",
    "体位改变时长",
    "身体变动时长",
  ];
  const series = [
    {
      name: data1.date,
      data: [
        movementData1.inactivity,
        movementData1.totalMovement,
        movementData1.positionChange,
        movementData1.bodyMovement,
      ],
      type: "bar",
      itemStyle: {
        color: "#5470c6",
      },
    },
    {
      name: data2.date,
      data: [
        movementData2.inactivity,
        movementData2.totalMovement,
        movementData2.positionChange,
        movementData2.bodyMovement,
      ],
      type: "bar",
      itemStyle: {
        color: "#91cc75",
      },
    },
  ];

  return {
    title: {
      text: "体动数据对比",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param: any) => {
          result += `${param.seriesName}: ${param.value}分钟<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: [data1.date, data2.date],
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: 80,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "时长(分钟)",
    },
    series: series,
  };
};
