import dayjs from "dayjs";
import { AnalysisData } from "../../../types/analysis";

/**
 * 计算时间的标准差（小时为单位）
 * @param times 时间数组（小时.分钟格式）
 * @returns 标准差
 */
const calculateTimeStandardDeviation = (times: number[]): number => {
  if (times.length <= 1) return 0;

  // 计算平均值
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length;

  // 计算方差
  const variance =
    times.reduce((sum, time) => {
      return sum + Math.pow(time - mean, 2);
    }, 0) / times.length;

  // 返回标准差（保留两位小数）
  return Math.sqrt(variance);
};

/**
 * 将时间字符串转换为小时数（考虑跨日）
 * @param timeStr 时间字符串 (HH:mm)
 * @returns 小时数（带小数点）
 */
const convertTimeToHours = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  // 如果是凌晨时间（0-4点），加上24小时以便于计算
  const adjustedHours = hours >= 0 && hours < 4 ? hours + 24 : hours;
  return adjustedHours + minutes / 60;
};

/**
 * 获取睡眠规律性分析图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getSleepRegularityStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_time_distribute_list) return {};

  // 提取入睡和起床时间
  const sleepTimes: number[] = [];
  const wakeUpTimes: number[] = [];

  // 工作日和周末的时间分离
  const workdaySleepTimes: number[] = [];
  const workdayWakeUpTimes: number[] = [];
  const weekendSleepTimes: number[] = [];
  const weekendWakeUpTimes: number[] = [];

  analysisData.sleep_time_distribute_list.forEach(([startTime, endTime]) => {
    const sleepDate = dayjs(startTime * 1000);
    const wakeUpDate = dayjs(endTime * 1000);

    const sleepTimeStr = sleepDate.format("HH:mm");
    const wakeUpTimeStr = wakeUpDate.format("HH:mm");

    const sleepTimeHours = convertTimeToHours(sleepTimeStr);
    const wakeUpTimeHours = convertTimeToHours(wakeUpTimeStr);

    sleepTimes.push(sleepTimeHours);
    wakeUpTimes.push(wakeUpTimeHours);

    // 判断是否为周末（周六和周日）
    const dayOfWeek = sleepDate.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      weekendSleepTimes.push(sleepTimeHours);
      weekendWakeUpTimes.push(wakeUpTimeHours);
    } else {
      workdaySleepTimes.push(sleepTimeHours);
      workdayWakeUpTimes.push(wakeUpTimeHours);
    }
  });

  // 计算标准差
  const sleepTimeSD = calculateTimeStandardDeviation(sleepTimes);
  const wakeUpTimeSD = calculateTimeStandardDeviation(wakeUpTimes);

  // 计算工作日和周末的平均值
  const avgWorkdaySleepTime = workdaySleepTimes.length
    ? workdaySleepTimes.reduce((sum, time) => sum + time, 0) /
      workdaySleepTimes.length
    : 0;
  const avgWorkdayWakeUpTime = workdayWakeUpTimes.length
    ? workdayWakeUpTimes.reduce((sum, time) => sum + time, 0) /
      workdayWakeUpTimes.length
    : 0;
  const avgWeekendSleepTime = weekendSleepTimes.length
    ? weekendSleepTimes.reduce((sum, time) => sum + time, 0) /
      weekendSleepTimes.length
    : 0;
  const avgWeekendWakeUpTime = weekendWakeUpTimes.length
    ? weekendWakeUpTimes.reduce((sum, time) => sum + time, 0) /
      weekendWakeUpTimes.length
    : 0;

  // 评估睡眠规律性
  const getSleepRegularityLevel = (sd: number): string => {
    if (sd < 0.5) return "非常规律";
    if (sd < 1.0) return "较为规律";
    if (sd < 1.5) return "一般规律";
    if (sd < 2.0) return "较不规律";
    return "非常不规律";
  };

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
      text: "睡眠规律性分析",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        return `<div>
          <p><b>${params[0].name}</b></p>
          <p>${params[0].marker}${params[0].seriesName}: ${formatHoursToTime(
          params[0].value
        )}</p>
          <p>${params[1].marker}${params[1].seriesName}: ${formatHoursToTime(
          params[1].value
        )}</p>
        </div>`;
      },
    },
    legend: {
      data: ["入睡时间", "起床时间"],
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: ["工作日", "周末"],
      axisLabel: {
        interval: 0,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "时间（小时）",
      axisLabel: {
        formatter: function (value: number) {
          return formatHoursToTime(value);
        },
      },
    },
    series: [
      {
        name: "入睡时间",
        type: "bar",
        data: [avgWorkdaySleepTime, avgWeekendSleepTime],
        itemStyle: {
          color: "#722ed1",
        },
        label: {
          show: true,
          position: "top",
          formatter: function (params: any) {
            return formatHoursToTime(params.value);
          },
        },
      },
      {
        name: "起床时间",
        type: "bar",
        data: [avgWorkdayWakeUpTime, avgWeekendWakeUpTime],
        itemStyle: {
          color: "#13c2c2",
        },
        label: {
          show: true,
          position: "top",
          formatter: function (params: any) {
            return formatHoursToTime(params.value);
          },
        },
      },
    ],
    // 额外数据，用于在组件中显示
    regularity: {
      sleepTimeSD,
      wakeUpTimeSD,
      sleepRegularityLevel: getSleepRegularityLevel(sleepTimeSD),
      wakeUpRegularityLevel: getSleepRegularityLevel(wakeUpTimeSD),
      socialJetLag: Math.abs(avgWeekendWakeUpTime - avgWorkdayWakeUpTime),
    },
  };
};
