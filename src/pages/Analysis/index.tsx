import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Select, DatePicker, Space } from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import styles from "./style.module.scss";

type ReportType = "weekly" | "monthly";

interface AnalysisData {
  date: string;
  sleepScore: number;
  sleepStages: {
    lightSleep: number;
    deepSleep: number;
    remSleep: number;
  };
  sleepTime: string;
  wakeTime: string;
}

interface EChartsTooltipParams {
  name: string;
  value: [string, string];
  data: [string, string];
}

const Analysis: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [analysisType, setAnalysisType] = useState<ReportType>("weekly");
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);

  // 处理日期选择变化
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    setSelectedDate(date);
  };

  // 处理报告类型变化
  const handleAnalysisTypeChange = (value: ReportType) => {
    setAnalysisType(value);
    setSelectedDate(null);
    setAnalysisData([]);
  };

  // 加载分析数据
  const loadAnalysisData = useCallback(async () => {
    if (!selectedDate) return;

    try {
      let startDate: dayjs.Dayjs;
      let endDate: dayjs.Dayjs;
      const today = dayjs();

      if (analysisType === "weekly") {
        // 获取所选日期所在周的周日（作为开始日期）
        startDate = selectedDate.startOf("week");
        // 获取所选日期所在周的周六（作为结束日期）
        endDate = selectedDate.endOf("week");
      } else {
        // 获取所选月份的第一天
        startDate = selectedDate.startOf("month");
        // 获取所选月份的最后一天
        endDate = selectedDate.endOf("month");
      }

      // 如果结束日期超过今天，则使用今天作为结束日期
      if (endDate.isAfter(today)) {
        endDate = today;
      }

      // 计算日期范围内的天数
      const days = endDate.diff(startDate, "day") + 1;

      const mockData: AnalysisData[] = Array.from({ length: days }, (_, i) => ({
        date: startDate.add(i, "day").format("MM-DD"),
        sleepScore: 60 + Math.floor(Math.random() * 30),
        sleepStages: {
          lightSleep: 200 + Math.floor(Math.random() * 100),
          deepSleep: 100 + Math.floor(Math.random() * 50),
          remSleep: 80 + Math.floor(Math.random() * 40),
        },
        sleepTime: `${20 + Math.floor(Math.random() * 4)}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
        wakeTime: `${6 + Math.floor(Math.random() * 4)}:${Math.floor(
          Math.random() * 60
        )
          .toString()
          .padStart(2, "0")}`,
      }));

      setAnalysisData(mockData);
    } catch (error) {
      console.error("加载分析数据失败:", error);
    }
  }, [selectedDate, analysisType]);

  // 当日期或报告类型改变时自动加载数据
  useEffect(() => {
    if (selectedDate) {
      loadAnalysisData();
    }
  }, [selectedDate, loadAnalysisData]);

  // 计算睡眠评分统计数据
  const getSleepScoreStats = () => {
    if (analysisData.length === 0) {
      return { max: 0, min: 0, avg: 0 };
    }
    const scores = analysisData.map((item) => item.sleepScore);
    return {
      max: Math.max(...scores),
      min: Math.min(...scores),
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    };
  };

  const sleepScoreStats = getSleepScoreStats();

  // 睡眠质量评分图表配置
  const scoreChartOption = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: analysisData.map((item) => item.date),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
    },
    series: [
      {
        data: analysisData.map((item) => item.sleepScore),
        type: "bar",
        itemStyle: {
          color: "#1890ff",
        },
      },
    ],
  };

  // 睡眠阶段时间图表配置
  const stagesChartOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["浅睡眠", "深睡眠", "REM睡眠"],
      bottom: 0,
    },
    xAxis: {
      type: "category",
      data: analysisData.map((item) => item.date),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "浅睡眠",
        type: "bar",
        stack: "total",
        data: analysisData.map((item) => item.sleepStages.lightSleep),
        itemStyle: { color: "#36A2EB" },
      },
      {
        name: "深睡眠",
        type: "bar",
        stack: "total",
        data: analysisData.map((item) => item.sleepStages.deepSleep),
        itemStyle: { color: "#0000FF" },
      },
      {
        name: "REM睡眠",
        type: "bar",
        stack: "total",
        data: analysisData.map((item) => item.sleepStages.remSleep),
        itemStyle: { color: "#FF6384" },
      },
    ],
  };

  // 入睡时间分布图表配置
  const sleepTimeScatterOption = {
    tooltip: {
      trigger: "axis",
      formatter: function (params: EChartsTooltipParams[]) {
        return `${params[0].name}: ${params[0].value[1]}`;
      },
    },
    grid: {
      left: "10%",
      right: "10%",
    },
    xAxis: {
      type: "category",
      data: analysisData.map((item) => item.date),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "category",
      data: ["20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00"],
      inverse: false,
    },
    series: [
      {
        name: "入睡时间",
        type: "scatter",
        symbolSize: 15,
        data: analysisData.map((item) => {
          const hour = parseInt(item.sleepTime.split(":")[0]);
          const timeList = [
            "20:00",
            "21:00",
            "22:00",
            "23:00",
            "00:00",
            "01:00",
            "02:00",
          ];
          const index = hour >= 20 ? hour - 20 : hour + 4; // 将时间转换为y轴索引
          return [item.date, timeList[index]];
        }),
        itemStyle: {
          color: "#1890ff",
        },
        label: {
          show: true,
          formatter: function (params: EChartsTooltipParams) {
            return params.value[1];
          },
          position: "right",
        },
      },
    ],
  };

  // 起床时间分布图表配置
  const wakeTimeScatterOption = {
    tooltip: {
      trigger: "axis",
      formatter: function (params: EChartsTooltipParams[]) {
        return `${params[0].name}: ${params[0].value[1]}`;
      },
    },
    grid: {
      left: "10%",
      right: "10%",
    },
    xAxis: {
      type: "category",
      data: analysisData.map((item) => item.date),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: "category",
      data: ["04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00"],
      inverse: false,
    },
    series: [
      {
        name: "起床时间",
        type: "scatter",
        symbolSize: 15,
        data: analysisData.map((item) => {
          const hour = parseInt(item.wakeTime.split(":")[0]);
          const timeList = [
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
          ];
          const index = hour - 4; // 将时间转换为y轴索引
          return [item.date, timeList[index]];
        }),
        itemStyle: {
          color: "#ff4d4f",
        },
        label: {
          show: true,
          formatter: function (params: EChartsTooltipParams) {
            return params.value[1];
          },
          position: "right",
        },
      },
    ],
  };

  // 获取最早和最晚起床时间
  const getWakeTimeRange = () => {
    if (analysisData.length === 0)
      return { earliest: "00:00", latest: "00:00" };

    const times = analysisData.map((item) => item.wakeTime);
    return {
      earliest: times.reduce((a, b) => (a < b ? a : b)),
      latest: times.reduce((a, b) => (a > b ? a : b)),
    };
  };

  const wakeTimeRange = getWakeTimeRange();

  return (
    <div>
      <Card title="数据分析" className={styles.analysisCard}>
        <Space className={styles.dateSelector}>
          <Select
            value={analysisType}
            onChange={handleAnalysisTypeChange}
            style={{ width: 120 }}
            options={[
              { label: "周报告", value: "weekly" },
              { label: "月报告", value: "monthly" },
            ]}
          />
          <DatePicker
            picker={analysisType === "weekly" ? "week" : "month"}
            value={selectedDate}
            onChange={handleDateChange}
            disabledDate={(current) => current && current.isAfter(dayjs())}
            format={analysisType === "weekly" ? "YYYY-wo" : "YYYY-MM"}
          />
        </Space>

        {analysisData.length > 0 && (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="睡眠质量评分" className={styles.chartCard}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div
                      style={{
                        display: "flex",
                        gap: "24px",
                        marginBottom: "16px",
                      }}
                    >
                      <div className={styles.statsCard}>
                        <div
                          className={styles.statsValue}
                          style={{ color: "#cf1322" }}
                        >
                          {sleepScoreStats.max}
                        </div>
                        <div className={styles.statsLabel}>最大值</div>
                      </div>
                      <div className={styles.statsCard}>
                        <div
                          className={styles.statsValue}
                          style={{ color: "#faad14" }}
                        >
                          {sleepScoreStats.avg}
                        </div>
                        <div className={styles.statsLabel}>平均值</div>
                      </div>
                      <div className={styles.statsCard}>
                        <div
                          className={styles.statsValue}
                          style={{ color: "#52c41a" }}
                        >
                          {sleepScoreStats.min}
                        </div>
                        <div className={styles.statsLabel}>最小值</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.chart}>
                      <ReactECharts
                        option={scoreChartOption}
                        style={{ height: "100%" }}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="睡眠阶段时间">
                <ReactECharts
                  option={stagesChartOption}
                  style={{ height: "300px" }}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="入睡时间分布">
                <ReactECharts
                  option={sleepTimeScatterOption}
                  style={{ height: "300px" }}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="起床时间分布">
                <ReactECharts
                  option={wakeTimeScatterOption}
                  style={{ height: "300px" }}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="起床时间范围">
                <Row justify="space-around" align="middle">
                  <Col>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#faad14",
                          marginBottom: "8px",
                        }}
                      >
                        最早起床时间
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {wakeTimeRange.earliest}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "16px",
                          color: "#52c41a",
                          marginBottom: "8px",
                        }}
                      >
                        最晚起床时间
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {wakeTimeRange.latest}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
};

export default Analysis;
