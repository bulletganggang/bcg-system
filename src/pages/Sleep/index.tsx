import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, DatePicker } from "antd";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd/es/date-picker";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const [loading, setLoading] = useState(true);

  // 根据 URL 参数更新选中日期
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get("date");
    if (dateParam) {
      setSelectedDate(dayjs(dateParam));
    }
  }, [location.search]);

  // 加载睡眠数据
  useEffect(() => {
    const loadSleepData = async () => {
      setLoading(true);
      try {
        // 这里应该是从API获取数据，现在用模拟数据
        const mockData: SleepData = {
          date: selectedDate.format("YYYY-MM-DD"),
          sleepTime: "23:30",
          wakeTime: "07:30",
          totalSleepTime: "8小时",
          sleepScore: 85,
          sleepStructure: {
            lightSleep: 240,
            deepSleep: 120,
            remSleep: 90,
            awake: 30,
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
            max: 18,
            avg: 14,
            min: 12,
          },
          heartRate: {
            max: 75,
            avg: 65,
            min: 58,
          },
          activityData: {
            inactiveTime: 490,
            activeTime: 50,
            positionChangeTime: 15,
            bodyMovementTime: 35,
          },
        };

        setSleepData(mockData);
      } catch (error) {
        console.error("加载睡眠数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSleepData();
  }, [selectedDate]);

  // 处理日期选择
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setSelectedDate(date);

      navigate("/sleep");
    }
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
            value: sleepData?.sleepStructure.lightSleep,
            itemStyle: { color: "#36A2EB" },
          },
          {
            name: "深睡",
            value: sleepData?.sleepStructure.deepSleep,
            itemStyle: { color: "#0000FF" },
          },
          {
            name: "REM睡眠",
            value: sleepData?.sleepStructure.remSleep,
            itemStyle: { color: "#FF6384" },
          },
          {
            name: "清醒",
            value: sleepData?.sleepStructure.awake,
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
      data: sleepData?.sleepStages.map((stage) => stage.time),
    },
    yAxis: {
      type: "category",
      data: ["浅睡眠", "深睡眠", "REM睡眠"],
    },
    series: [
      {
        type: "line",
        smooth: true,
        data: sleepData?.sleepStages.map((stage) => {
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
      max: roundUp(sleepData?.activityData.inactiveTime || 0, 100),
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
            value: sleepData?.activityData.inactiveTime,
            itemStyle: { color: "#B39DDB" },
          },
          {
            value: sleepData?.activityData.activeTime,
            itemStyle: { color: "#FFB74D" },
          },
          {
            value: sleepData?.activityData.positionChangeTime,
            itemStyle: { color: "#4FC3F7" },
          },
          {
            value: sleepData?.activityData.bodyMovementTime,
            itemStyle: { color: "#FF8A65" },
          },
        ],
      },
    ],
  };

  if (loading) {
    return <Card loading={true} />;
  }

  if (!sleepData) {
    return <Card>暂无数据</Card>;
  }

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
                夜间睡眠时长 {sleepData.sleepTime} ~ {sleepData.wakeTime}
              </h3>
              <Row gutter={16}>
                <Col span={12}>
                  <Card className={styles.statsCard}>
                    <div className={styles.title}>睡眠质量评分</div>
                    <Statistic
                      value={sleepData.sleepScore}
                      suffix="/100"
                      valueStyle={{ color: "#1890ff", fontSize: "24px" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card className={styles.statsCard}>
                    <div className={styles.title}>总睡眠时长</div>
                    <Statistic
                      value={sleepData.totalSleepTime}
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
                    value={sleepData.breathingRate.max}
                    suffix="bpm"
                    valueStyle={{ color: "#cf1322" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>平均</div>
                  <Statistic
                    value={sleepData.breathingRate.avg}
                    suffix="bpm"
                    valueStyle={{ color: "#3f8600" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>最小</div>
                  <Statistic
                    value={sleepData.breathingRate.min}
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
                    value={sleepData.heartRate.max}
                    suffix="bpm"
                    valueStyle={{ color: "#cf1322" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>平均</div>
                  <Statistic
                    value={sleepData.heartRate.avg}
                    suffix="bpm"
                    valueStyle={{ color: "#3f8600" }}
                    className={styles.rateValue}
                  />
                </Col>
                <Col span={8}>
                  <div className={styles.rateTitle}>最小</div>
                  <Statistic
                    value={sleepData.heartRate.min}
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
                您的总睡眠时长为{sleepData.totalSleepTime}
                ，符合成年人推荐的7-9小时标准。继续保持良好的作息习惯。
              </p>
              <p>
                深睡眠时长为{sleepData.sleepStructure.deepSleep}
                分钟，符合推荐时长。继续保持良好的睡眠习惯。
              </p>
              <p>
                REM睡眠时长为{sleepData.sleepStructure.remSleep}
                分钟，良好。继续保持充足的睡眠，帮助身体恢复和记忆巩固。
              </p>
              <p>
                呼吸频率为{sleepData.breathingRate.avg}
                次/分钟，略高于或低于正常范围。建议保持规律的锻炼，保持健康的生活方式，若有异常，请及时咨询医生。
              </p>
              <p>
                呼吸频率在正常范围内，表明您的睡眠状态良好。继续保持健康生活方式。
              </p>
              <p>
                体动时长为{sleepData.activityData.activeTime}
                分钟，属于轻度活动。可能会影响睡眠质量。建议检查床垫、枕头是否合适，尽量减少睡眠中的体动。
              </p>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Sleep;
