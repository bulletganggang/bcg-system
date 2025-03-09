import dayjs from "dayjs";
import { AnalysisData } from "../../../types/analysis";

/**
 * 获取睡眠周期图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getSleepCycleStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_time_distribute_list) return {};

  // 提取睡眠周期数据
  const sleepCycleData: Array<{
    date: string;
    day: string;
    isWeekend: boolean;
    sleepTime: number;
    wakeUpTime: number;
    duration: number;
  }> = [];

  analysisData.sleep_time_distribute_list.forEach(([startTime, endTime]) => {
    const sleepDate = dayjs(startTime * 1000);
    const wakeUpDate = dayjs(endTime * 1000);

    // 计算睡眠时长（小时）
    const durationHours = (endTime - startTime) / 3600;

    // 获取日期和星期
    const date = sleepDate.format("MM-DD");
    const dayOfWeek = sleepDate.day();
    const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    const day = dayNames[dayOfWeek];
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 转换为24小时制的小时数（带小数点）
    const sleepHour = sleepDate.hour() + sleepDate.minute() / 60;
    // 如果睡眠时间在凌晨（0-4点），加上24小时以便于可视化
    const adjustedSleepHour =
      sleepDate.hour() >= 0 && sleepDate.hour() < 4
        ? sleepHour + 24
        : sleepHour;

    const wakeUpHour = wakeUpDate.hour() + wakeUpDate.minute() / 60;

    sleepCycleData.push({
      date,
      day,
      isWeekend,
      sleepTime: adjustedSleepHour,
      wakeUpTime: wakeUpHour,
      duration: durationHours,
    });
  });

  // 按日期排序
  sleepCycleData.sort((a, b) => {
    const dateA = dayjs(`2023-${a.date}`);
    const dateB = dayjs(`2023-${b.date}`);
    return dateA.valueOf() - dateB.valueOf();
  });

  // 准备图表数据
  const dates = sleepCycleData.map((item) => `${item.date} ${item.day}`);
  const sleepTimes = sleepCycleData.map((item) => item.sleepTime);
  const wakeUpTimes = sleepCycleData.map((item) => item.wakeUpTime);
  const durations = sleepCycleData.map((item) => item.duration);
  const isWeekends = sleepCycleData.map((item) => item.isWeekend);

  // 格式化小时数为时间字符串
  const formatHoursToTime = (hours: number): string => {
    const adjustedHours = hours >= 24 ? hours - 24 : hours;
    const hoursPart = Math.floor(adjustedHours);
    const minutesPart = Math.round((adjustedHours - hoursPart) * 60);
    return `${String(hoursPart).padStart(2, "0")}:${String(
      minutesPart
    ).padStart(2, "0")}`;
  };

  return {
    title: {
      text: "睡眠周期图",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        const index = params[0].dataIndex;
        const date = dates[index];
        const sleepTime = formatHoursToTime(sleepTimes[index]);
        const wakeUpTime = formatHoursToTime(wakeUpTimes[index]);
        const duration = durations[index].toFixed(1);

        return `<div>
          <p><b>${date}</b></p>
          <p>${params[0].marker}入睡时间: ${sleepTime}</p>
          <p>${params[1].marker}起床时间: ${wakeUpTime}</p>
          <p>${params[2].marker}睡眠时长: ${duration}小时</p>
        </div>`;
      },
    },
    legend: {
      data: ["入睡时间", "起床时间", "睡眠时长"],
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        interval: 0,
        rotate: 45,
        formatter: function (value: string, index: number) {
          return isWeekends[index] ? `{weekend|${value}}` : value;
        },
        rich: {
          weekend: {
            color: "#ff4d4f",
          },
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "时间",
        min: 0,
        max: 24,
        interval: 4,
        axisLabel: {
          formatter: function (value: number) {
            return formatHoursToTime(value);
          },
        },
      },
      {
        type: "value",
        name: "时长(小时)",
        min: 0,
        max: function (value: { max: number }) {
          return Math.ceil(value.max) + 2;
        },
        interval: 2,
      },
    ],
    series: [
      {
        name: "入睡时间",
        type: "line",
        data: sleepTimes,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#722ed1",
        },
        lineStyle: {
          width: 2,
        },
        markArea: {
          itemStyle: {
            color: "rgba(114, 46, 209, 0.1)",
          },
          data: sleepCycleData
            .map((_, index) => {
              if (isWeekends[index]) {
                return [
                  {
                    xAxis: index,
                  },
                  {
                    xAxis: index + 1,
                  },
                ];
              }
              return [];
            })
            .filter((item) => item.length > 0),
        },
      },
      {
        name: "起床时间",
        type: "line",
        data: wakeUpTimes,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          color: "#13c2c2",
        },
        lineStyle: {
          width: 2,
        },
      },
      {
        name: "睡眠时长",
        type: "bar",
        yAxisIndex: 1,
        data: durations,
        itemStyle: {
          color: "#52c41a",
          opacity: 0.6,
        },
      },
    ],
  };
};
