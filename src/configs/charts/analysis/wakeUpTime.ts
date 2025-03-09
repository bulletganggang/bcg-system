import dayjs from "dayjs";
import { AnalysisData } from "../../../types/analysis";

/**
 * 获取起床时间分布图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getWakeUpTimeStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_time_distribute_list) return {};

  // 此时我们已经确认 sleep_time_distribute_list 不为 null 或 undefined
  const distributeList = analysisData.sleep_time_distribute_list;

  const data = distributeList.map(([_, endTime]) => {
    const time = dayjs(endTime * 1000);
    const hour = Number(time.format("HH"));
    const minute = Number(time.format("mm"));

    // 将时间转换为小时的数值表示
    const timeValue = hour + minute / 60;

    return {
      time: time.format("HH:mm"),
      date: time.format("MM-DD"),
      timeValue: timeValue,
    };
  });

  return {
    title: {
      text: "起床时间分布",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const item = params[0];
        if (item && item.data) {
          return `${item.data.date} ${item.data.time}`;
        }
        return "";
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
      data: data.map((item) => item.date),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      min: 5, // 从早上5点开始
      max: 13, // 到下午1点
      interval: 1,
      axisLabel: {
        formatter: (value: number) => {
          return `${String(Math.floor(value)).padStart(2, "0")}:00`;
        },
      },
    },
    series: [
      {
        name: "起床时间",
        type: "scatter",
        data: data.map((item) => ({
          value: [item.date, item.timeValue],
          time: item.time,
          date: item.date,
          itemStyle: {
            color: "#1890ff",
          },
        })),
        symbolSize: 10,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
      },
    ],
  };
};
