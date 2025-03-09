import dayjs from "dayjs";
import { AnalysisData } from "../../../types/analysis";

/**
 * 获取入睡时间分布图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getSleepTimeStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_time_distribute_list) return {};

  // 此时我们已经确认 sleep_time_distribute_list 不为 null 或 undefined
  const distributeList = analysisData.sleep_time_distribute_list;

  const data = distributeList.map(([startTime]) => {
    const time = dayjs(startTime * 1000);
    const hour = Number(time.format("HH"));
    const minute = Number(time.format("mm"));

    // 将时间转换为小时的数值表示，凌晨时段(0-4点)加24小时
    const timeValue = hour + minute / 60;
    const adjustedTimeValue =
      hour >= 0 && hour < 4 ? timeValue + 24 : timeValue;

    return {
      time: time.format("HH:mm"),
      date: time.format("MM-DD"),
      timeValue: adjustedTimeValue,
    };
  });

  return {
    title: {
      text: "入睡时间分布",
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
      min: 20, // 从晚上8点开始
      max: 28, // 到凌晨4点（28表示第二天4点）
      interval: 1,
      axisLabel: {
        formatter: (value: number) => {
          // 处理跨天的情况
          const hour = value >= 24 ? value - 24 : value;
          return `${String(Math.floor(hour)).padStart(2, "0")}:00`;
        },
      },
    },
    series: [
      {
        name: "入睡时间",
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
