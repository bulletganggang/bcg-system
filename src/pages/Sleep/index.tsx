import React, { useState } from "react";
import { Card, Row, Col, Statistic, DatePicker } from "antd";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd/es/date-picker";
import styles from "./style.module.scss";
import { roundUp } from "@/utils/math";

interface SleepData {
  date: string;
  sleepTime: string;
  wakeTime: string;
  totalSleepTime: string;
  sleepScore: number;
  sleepStructure: {
    lightSleep: number;
    deepSleep: number;
    remSleep: number;
    awake: number;
  };
  sleepStages: Array<{
    time: string;
    stage: "rem" | "light" | "deep" | "awake";
  }>;
  breathingRate: {
    max: number;
    avg: number;
    min: number;
  };
  heartRate: {
    max: number;
    avg: number;
    min: number;
  };
  activityData: {
    inactiveTime: number;
    activeTime: number;
    positionChangeTime: number;
    bodyMovementTime: number;
  };
}

const Sleep: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // 处理日期选择
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setSelectedDate(date);
      // TODO: 这里可以调用后端API获取对应日期的数据
    }
  };

  // 模拟数据
  const mockSleepData: SleepData = {
    date: selectedDate.format("YYYY-MM-DD"),
    sleepTime: "00:00",
    wakeTime: "09:00",
    totalSleepTime: "9小时0分",
    sleepScore: 80,
    sleepStructure: {
      lightSleep: 300,
      deepSleep: 120,
      remSleep: 110,
      awake: 10,
    },
    sleepStages: [
      { time: "01:00", stage: "light" },
      { time: "02:00", stage: "deep" },
      { time: "04:00", stage: "rem" },
      { time: "05:00", stage: "light" },
      { time: "06:00", stage: "deep" },
      { time: "08:00", stage: "light" },
    ],
    breathingRate: {
      max: 19,
      avg: 15,
      min: 11,
    },
    heartRate: {
      max: 75,
      avg: 65,
      min: 55,
    },
    activityData: {
      inactiveTime: 490,
      activeTime: 50,
      positionChangeTime: 15,
      bodyMovementTime: 35,
    },
  };

  // 睡眠结构饼图配置
  const pieOption = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}分钟 ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: 0,
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        data: [
          {
            name: "浅睡",
            value: mockSleepData.sleepStructure.lightSleep,
            itemStyle: { color: "#36A2EB" },
          },
          {
            name: "深睡",
            value: mockSleepData.sleepStructure.deepSleep,
            itemStyle: { color: "#0000FF" },
          },
          {
            name: "REM睡眠",
            value: mockSleepData.sleepStructure.remSleep,
            itemStyle: { color: "#FF6384" },
          },
          {
            name: "清醒",
            value: mockSleepData.sleepStructure.awake,
            itemStyle: { color: "#4BC0C0" },
          },
        ],
      },
    ],
  };

  // 睡眠阶段图配置
  const stagesOption = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: mockSleepData.sleepStages.map((stage) => stage.time),
    },
    yAxis: {
      type: "category",
      data: ["浅睡眠", "深睡眠", "REM睡眠"],
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: mockSleepData.sleepStages.map((stage) => {
          switch (stage.stage) {
            case "light":
              return "浅睡眠";
            case "deep":
              return "深睡眠";
            case "rem":
              return "REM睡眠";
            default:
              return null;
          }
        }),
        lineStyle: { color: "#36A2EB" },
      },
    ],
  };

  // 体动检测柱状图配置
  const activityOption = {
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "value",
      max: roundUp(mockSleepData.activityData.inactiveTime, 100),
    },
    yAxis: {
      type: "category",
      data: ["不活跃时长", "体动总时长", "体位改变时长", "身体变动时长"],
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: mockSleepData.activityData.inactiveTime,
            itemStyle: { color: "#B39DDB" },
          },
          {
            value: mockSleepData.activityData.activeTime,
            itemStyle: { color: "#FFB74D" },
          },
          {
            value: mockSleepData.activityData.positionChangeTime,
            itemStyle: { color: "#4FC3F7" },
          },
          {
            value: mockSleepData.activityData.bodyMovementTime,
            itemStyle: { color: "#FF8A65" },
          },
        ],
      },
    ],
  };

  return (
    <div>
      <Card
        title="睡眠数据"
        extra={
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            disabledDate={(current) => current && current.isAfter(dayjs())}
          />
        }
        className={styles.sleepCard}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.header}>
              <h3 className={styles.timeRange}>
                夜间睡眠时长 {mockSleepData.sleepTime} ~{" "}
                {mockSleepData.wakeTime}
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Card className={styles.statsCard}>
                    <div className={styles.title}>睡眠质量评分</div>
                    <Statistic
                      value={mockSleepData.sleepScore}
                      suffix="/100"
                      valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className={styles.statsCard}>
                    <div className={styles.title}>总睡眠时长</div>
                    <Statistic
                      value={mockSleepData.totalSleepTime}
                      valueStyle={{ color: "#52c41a", fontSize: "24px" }}
                    />
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="睡眠结构" className={styles.chartCard}>
              <div className={styles.chart}>
                <ReactECharts option={pieOption} style={{ height: "100%" }} />
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="睡眠阶段" className={styles.chartCard}>
              <div className={styles.chart}>
                <ReactECharts
                  option={stagesOption}
                  style={{ height: "100%" }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="呼吸频率(次/分钟)" className={styles.rateCard}>
              <Row gutter={16}>
                <Col span={8}>
                  <div className={styles.rateTitle}>最大</div>
                  <Statistic
                    value={mockSleepData.breathingRate.max}
                    suffix="bpm"
                    valueStyle={{ color: "#cf1322" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>平均</div>
                  <Statistic
                    value={mockSleepData.breathingRate.avg}
                    suffix="bpm"
                    valueStyle={{ color: "#3f8600" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>最小</div>
                  <Statistic
                    value={mockSleepData.breathingRate.min}
                    suffix="bpm"
                    valueStyle={{ color: "#096dd9" }}
                    className={styles.rateValue}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="心率(次/分钟)" className={styles.rateCard}>
              <Row gutter={16}>
                <Col span={8}>
                  <div className={styles.rateTitle}>最大</div>
                  <Statistic
                    value={mockSleepData.heartRate.max}
                    suffix="bpm"
                    valueStyle={{ color: "#cf1322" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>平均</div>
                  <Statistic
                    value={mockSleepData.heartRate.avg}
                    suffix="bpm"
                    valueStyle={{ color: "#3f8600" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>最小</div>
                  <Statistic
                    value={mockSleepData.heartRate.min}
                    suffix="bpm"
                    valueStyle={{ color: "#096dd9" }}
                    className={styles.rateValue}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="体动检测" className={styles.chartCard}>
              <div className={styles.chart}>
                <ReactECharts
                  option={activityOption}
                  style={{ height: "100%" }}
                />
              </div>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="总结与建议" className={styles.summaryCard}>
              <p>
                您的总睡眠时长为{mockSleepData.totalSleepTime}
                ，符合成年人推荐的7-9小时标准。继续保持良好的作息习惯。
              </p>
              <p>深睡眠时长为120分钟，符合推荐时长。继续保持良好的睡眠习惯。</p>
              <p>
                REM睡眠时长为110分钟，良好。继续保持充足的睡眠，帮助身体恢复和记忆巩固。
              </p>
              <p>
                呼吸频率为15次/分钟，略高于或低于正常范围。建议保持规律的锻炼，保持健康的生活方式，若有异常，请及时咨询医生。
              </p>
              <p>
                呼吸频率在正常范围内，表明您的睡眠状态良好。继续保持健康生活方式。
              </p>
              <p>
                体动时长为50分钟，属于轻度活动。可能会影响睡眠质量。建议检查床垫、枕头是否合适，尽量减少睡眠中的体动。
              </p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Sleep;
