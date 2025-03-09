import { AnalysisData } from "../../../types/analysis";
import dayjs from "dayjs";

/**
 * 获取睡眠时长图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getSleepDurationStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_stage_time_list || !analysisData?.timestamp_list) {
    return {};
  }

  // 此时我们已经确认 sleep_stage_time_list 和 timestamp_list 不为 null 或 undefined
  const stageTimeList = analysisData.sleep_stage_time_list;
  const timestampList = analysisData.timestamp_list;

  const data = timestampList.map((timestamp, index) => {
    // 确保索引有效
    const stageData =
      index < stageTimeList.length
        ? stageTimeList[index]
        : {
            light_sleep_overall_minutes: 0,
            deep_sleep_overall_minutes: 0,
            rem_sleep_overall_minutes: 0,
          };

    return [
      dayjs(timestamp * 1000).format("MM-DD"),
      [
        stageData.light_sleep_overall_minutes,
        stageData.deep_sleep_overall_minutes,
        stageData.rem_sleep_overall_minutes,
      ],
    ];
  });

  return {
    title: {
      text: "睡眠时长分布",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        const date = params[0].name;
        let result = `${date}<br/>`;
        params.forEach((param: any) => {
          result += `${param.seriesName}: ${param.value}分钟<br/>`;
        });
        return result;
      },
    },
    grid: {
      top: 100,
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    legend: {
      data: ["浅睡", "深睡", "REM"],
      top: "bottom",
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item[0]),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "时长(分钟)",
    },
    series: [
      {
        name: "浅睡",
        type: "bar",
        stack: "sleep",
        data: data.map((item) => item[1][0]),
        itemStyle: {
          color: "#91d5ff",
        },
      },
      {
        name: "深睡",
        type: "bar",
        stack: "sleep",
        data: data.map((item) => item[1][1]),
        itemStyle: {
          color: "#1890ff",
        },
      },
      {
        name: "REM",
        type: "bar",
        stack: "sleep",
        data: data.map((item) => item[1][2]),
        itemStyle: {
          color: "#0050b3",
        },
      },
    ],
  };
};
