import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Space,
  Alert,
  Statistic,
} from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import {
  HeartOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
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

interface AnomalyStats {
  heartRateAnomalies: number;
  sleepDurationAnomalies: number;
  sleepQualityAnomalies: number;
  sleepPatternAnomalies: number;
  totalRecords: number;
}

interface HealthAdvice {
  type: "success" | "info" | "warning" | "error";
  message: string;
  description: string;
}

const Analysis: React.FC = () => {
  // 初始化为当前日期
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [analysisType, setAnalysisType] = useState<ReportType>("weekly");
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [anomalyStats, setAnomalyStats] = useState<AnomalyStats>({
    heartRateAnomalies: 0,
    sleepDurationAnomalies: 0,
    sleepQualityAnomalies: 0,
    sleepPatternAnomalies: 0,
    totalRecords: 0,
  });
  const [healthAdvice, setHealthAdvice] = useState<HealthAdvice[]>([]);

  // 处理日期选择变化
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    setSelectedDate(date || dayjs());
  };

  // 处理报告类型变化
  const handleAnalysisTypeChange = (value: ReportType) => {
    setAnalysisType(value);
    setSelectedDate(dayjs()); // 切换报告类型时重置为当前日期
    setAnalysisData([]);
    setLoading(true);
  };

  // 加载分析数据
  const loadAnalysisData = useCallback(async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  // 分析异常数据
  const analyzeAnomalies = useCallback((data: AnalysisData[]) => {
    let stats = {
      heartRateAnomalies: 0,
      sleepDurationAnomalies: 0,
      sleepQualityAnomalies: 0,
      sleepPatternAnomalies: 0,
      totalRecords: data.length,
    };

    let advice: HealthAdvice[] = [];

    // 计算平均睡眠时间和标准差
    const avgSleepDuration =
      data.reduce((sum, item) => {
        const totalSleep =
          item.sleepStages.lightSleep +
          item.sleepStages.deepSleep +
          item.sleepStages.remSleep;
        return sum + totalSleep;
      }, 0) / data.length;

    data.forEach((item) => {
      // 检查睡眠评分
      if (item.sleepScore < 60) {
        stats.sleepQualityAnomalies++;
      }

      // 检查总睡眠时长
      const totalSleep =
        item.sleepStages.lightSleep +
        item.sleepStages.deepSleep +
        item.sleepStages.remSleep;
      if (totalSleep < 360 || totalSleep > 600) {
        // 6-10小时为正常范围
        stats.sleepDurationAnomalies++;
      }

      // 检查深睡眠比例
      const deepSleepRatio = item.sleepStages.deepSleep / totalSleep;
      if (deepSleepRatio < 0.2) {
        // 深睡眠比例应该大于20%
        stats.sleepQualityAnomalies++;
      }

      // 检查入睡时间规律性
      const sleepHour = parseInt(item.sleepTime.split(":")[0]);
      if (sleepHour < 21 || sleepHour > 23) {
        stats.sleepPatternAnomalies++;
      }
    });

    // 生成健康建议
    if (stats.sleepQualityAnomalies > data.length * 0.3) {
      advice.push({
        type: "warning",
        message: "睡眠质量提醒",
        description:
          "您的深睡眠比例偏低，建议：1. 保持规律的作息时间 2. 睡前避免剧烈运动 3. 创造安静舒适的睡眠环境",
      });
    }

    if (stats.sleepDurationAnomalies > data.length * 0.3) {
      const avgHours = Math.round(avgSleepDuration / 60);
      advice.push({
        type: "error",
        message: "睡眠时长提醒",
        description: `您的平均睡眠时长为${avgHours}小时，${
          avgHours < 7 ? "睡眠时间不足" : "睡眠时间过长"
        }。建议保持7-8小时的睡眠时间，有助于身体恢复和精力充沛。`,
      });
    }

    if (stats.sleepPatternAnomalies > data.length * 0.3) {
      advice.push({
        type: "warning",
        message: "作息规律提醒",
        description:
          "您的作息时间不够规律，建议：1. 制定固定的作息计划 2. 避免熬夜 3. 保持规律的运动习惯",
      });
    }
    setAnomalyStats(stats);
    setHealthAdvice(advice);
  }, []);

  // 在数据加载完成后进行异常分析
  useEffect(() => {
    if (analysisData.length > 0) {
      analyzeAnomalies(analysisData);
    }
  }, [analysisData, analyzeAnomalies]);

  return (
    <div>
      <Card title="数据分析" className={styles.analysisCard} loading={loading}>
        <Space className={styles.dateSelector}>
          <Select
            value={analysisType}
            onChange={handleAnalysisTypeChange}
            style={{ width: 120 }}
            options={[
              { label: "周报告", value: "weekly" },
              { label: "月报告", value: "monthly" },
            ]}
            disabled={loading}
          />
          <DatePicker
            picker={analysisType === "weekly" ? "week" : "month"}
            value={selectedDate}
            onChange={handleDateChange}
            disabledDate={(current) => current && current.isAfter(dayjs())}
            format={analysisType === "weekly" ? "YYYY-wo" : "YYYY-MM"}
            disabled={loading}
          />
        </Space>

        {!loading && analysisData.length > 0 && (
          <Row gutter={[16, 16]}>
            {/* 异常数据统计卡片 */}
            <Col span={24}>
              <Card title="异常数据统计" className={styles.anomalyCard}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="睡眠质量异常"
                      value={anomalyStats.sleepQualityAnomalies}
                      suffix={`/ ${anomalyStats.totalRecords}`}
                      prefix={<HeartOutlined />}
                      valueStyle={{ color: "#ff4d4f" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="睡眠时长异常"
                      value={anomalyStats.sleepDurationAnomalies}
                      suffix={`/ ${anomalyStats.totalRecords}`}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#faad14" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="睡眠规律异常"
                      value={anomalyStats.sleepPatternAnomalies}
                      suffix={`/ ${anomalyStats.totalRecords}`}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Statistic
                      title="总异常次数"
                      value={
                        anomalyStats.sleepQualityAnomalies +
                        anomalyStats.sleepDurationAnomalies +
                        anomalyStats.sleepPatternAnomalies
                      }
                      suffix={`/ ${anomalyStats.totalRecords * 3}`}
                      prefix={<AlertOutlined />}
                      valueStyle={{
                        color:
                          anomalyStats.sleepQualityAnomalies > 0
                            ? "#ff4d4f"
                            : "#52c41a",
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 健康建议 */}
            <Col span={24}>
              <Card title="健康建议">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {healthAdvice.map((advice, index) => (
                    <Alert
                      key={index}
                      message={advice.message}
                      description={advice.description}
                      type={advice.type}
                      showIcon
                    />
                  ))}
                  {healthAdvice.length === 0 && (
                    <Alert
                      message="状态良好"
                      description="您的睡眠状况良好，请继续保持！"
                      type="success"
                      showIcon
                    />
                  )}
                </Space>
              </Card>
            </Col>

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
