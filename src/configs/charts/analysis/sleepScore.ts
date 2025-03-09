import dayjs from "dayjs";
import { AnalysisData } from "../../../types/analysis";

/**
 * 获取睡眠评分图表配置
 * @param analysisData 分析数据
 * @returns ECharts配置项
 */
export const getSleepScoreStats = (analysisData: AnalysisData | null) => {
  if (!analysisData?.sleep_score_list || !analysisData?.timestamp_list) {
    return {};
  }

  const data = analysisData.sleep_score_list.map((score, index) => {
    // 确保 timestamp_list 存在且索引有效
    const timestamp =
      analysisData.timestamp_list && index < analysisData.timestamp_list.length
        ? analysisData.timestamp_list[index]
        : 0;

    return {
      date: dayjs(timestamp * 1000).format("MM-DD"),
      score,
    };
  });

  return {
    title: {
      text: "睡眠质量评分",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: "{b}: {c}分",
    },
    grid: {
      top: 80,
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
      min: 0,
      max: 100,
      interval: 20,
    },
    series: [
      {
        name: "睡眠评分",
        type: "line",
        data: data.map((item) => item.score),
        markLine: {
          data: [
            {
              type: "average",
              name: "平均值",
            },
          ],
          label: {
            formatter: "平均: {c}",
            position: "middle",
          },
        },
        lineStyle: {
          width: 3,
          color: "#1890ff",
        },
        itemStyle: {
          color: "#1890ff",
        },
        smooth: true,
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
