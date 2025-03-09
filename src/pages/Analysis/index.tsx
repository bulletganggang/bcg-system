import React, { useState, useEffect } from "react";
import {
  Card,
  DatePicker,
  Radio,
  Row,
  Col,
  Statistic,
  Empty,
  Spin,
} from "antd";
import {
  LineChartOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getRangeData } from "@/api";
import type { ReportType, AnalysisData } from "@/types";
import styles from "./style.module.scss";
import {
  getSleepScoreStats,
  getSleepDurationStats,
  getSleepTimeStats,
  getWakeUpTimeStats,
} from "@/configs/charts/analysis";
import { getExportConfig, getExportFileName } from "@/utils/pdf-sheet-export";
import ExportButton from "@/components/ExportButton";

// 添加 weekOfYear 插件以支持周数计算
dayjs.extend(weekOfYear);

const Analysis: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("weekly");
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const currentDevice = useSelector(
    (state: RootState) => state.device.currentDevice
  );
  const { userId } = useSelector((state: RootState) => state.user);

  // 获取日期范围
  const getDateRange = (date: Dayjs, type: ReportType): [string, string] => {
    const today = dayjs();
    let startDate: Dayjs;
    let endDate: Dayjs;

    if (type === "weekly") {
      // 获取选中周的起始和结束日期
      startDate = date.startOf("week");
      endDate = date.endOf("week");

      // 如果是当前周，结束日期不能超过今天
      if (date.week() === today.week() && date.year() === today.year()) {
        endDate = today;
      }
    } else {
      // 获取选中月的起始和结束日期
      startDate = date.startOf("month");
      endDate = date.endOf("month");

      // 如果是当前月，结束日期不能超过今天
      if (date.month() === today.month() && date.year() === today.year()) {
        endDate = today;
      }
    }

    return [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")];
  };

  // 加载分析数据
  const loadAnalysisData = async (date: Dayjs, type: ReportType) => {
    if (!currentDevice?.deviceCode) {
      return;
    }

    try {
      setLoading(true);
      const [startDate, endDate] = getDateRange(date, type);

      const response = await getRangeData({
        startDate,
        endDate,
        deviceCode: currentDevice.deviceCode,
        userId,
      });

      setAnalysisData(response.data);
    } catch (error) {
      console.error("加载分析数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 日期或报告类型变化时重新加载数据
  useEffect(() => {
    loadAnalysisData(selectedDate, reportType);
  }, [selectedDate, reportType, currentDevice]);

  // 处理日期选择变化
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // 处理报告类型变化
  const handleReportTypeChange = (value: ReportType) => {
    setReportType(value);
    // 切换报告类型时，重置为当前日期
    setSelectedDate(dayjs());
  };

  // 准备导出数据
  const prepareExportData = () => {
    if (!analysisData) return undefined;

    const dateRange = getDateRange(selectedDate, reportType);
    return getExportConfig(analysisData, reportType, dateRange);
  };

  // 获取导出文件名
  const getFileName = () => {
    return getExportFileName(selectedDate, reportType);
  };

  // 渲染空状态
  const renderEmptyState = () => {
    if (!currentDevice) {
      return (
        <Empty
          description={
            <div className={styles.emptyText}>
              <p>您还未绑定任何设备</p>
              <p>请前往个人中心绑定设备后查看数据</p>
            </div>
          }
        />
      );
    }

    if (loading) {
      return null;
    }

    if (!analysisData?.sleep_score_list) {
      return (
        <Empty
          description={
            <div className={styles.emptyText}>
              <p>暂无分析数据</p>
              <p>请选择其他日期查看</p>
            </div>
          }
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.analysisCard}>
      <Card
        title="数据分析"
        extra={
          <div className={styles.dateSelector}>
            <Radio.Group
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="weekly">周报告</Radio.Button>
              <Radio.Button value="monthly">月报告</Radio.Button>
            </Radio.Group>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              picker={reportType === "weekly" ? "week" : "month"}
              disabledDate={(current) => current && current.isAfter(dayjs())}
              allowClear={false}
            />
            <ExportButton
              excelData={prepareExportData()}
              fileNamePrefix={getFileName()}
              disabled={!analysisData?.sleep_score_list || loading}
            />
          </div>
        }
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : !analysisData?.sleep_score_list ? (
          renderEmptyState()
        ) : (
          <>
            <Row gutter={[16, 16]} className={styles.statsRow}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={
                      <div>
                        <LineChartOutlined /> 平均睡眠评分
                      </div>
                    }
                    value={analysisData.avg_sleep_score}
                    suffix="/ 100"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={
                      <div>
                        <ClockCircleOutlined /> 平均入睡时间
                      </div>
                    }
                    value={analysisData.avg_start_sleep_time}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={
                      <div>
                        <RiseOutlined /> 平均起床时间
                      </div>
                    }
                    value={analysisData.avg_wakeUp_time}
                    valueStyle={{ color: "#13c2c2" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={
                      <div>
                        <CheckCircleOutlined /> 平均睡眠时长
                      </div>
                    }
                    value={`${Math.floor(
                      (analysisData.avg_sleep_duration_time || 0) / 60
                    )}小时${
                      (analysisData.avg_sleep_duration_time || 0) % 60
                    }分钟`}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
            </Row>

            <Card className={`${styles.chartCard} ${styles.mainChart}`}>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  <ReactECharts
                    option={getSleepScoreStats(analysisData)}
                    style={{ height: "100%", minHeight: "500px" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
                <div className={styles.statsPanel}>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最高评分</div>
                    <div className={styles.value} style={{ color: "#52c41a" }}>
                      {analysisData.max_sleep_score}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>平均评分</div>
                    <div className={styles.value} style={{ color: "#1890ff" }}>
                      {analysisData.avg_sleep_score}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最低评分</div>
                    <div className={styles.value} style={{ color: "#ff4d4f" }}>
                      {analysisData.min_sleep_score}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={`${styles.chartCard} ${styles.mainChart}`}>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  <ReactECharts
                    option={getSleepDurationStats(analysisData)}
                    style={{ height: "100%", minHeight: "500px" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
                <div className={styles.statsPanel}>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最长时间</div>
                    <div className={styles.value} style={{ color: "#52c41a" }}>
                      {Math.floor(analysisData.max_sleep_duration_time! / 60)}
                      小时
                      {analysisData.max_sleep_duration_time! % 60}分钟
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>平均时间</div>
                    <div className={styles.value} style={{ color: "#1890ff" }}>
                      {Math.floor(analysisData.avg_sleep_duration_time! / 60)}
                      小时
                      {analysisData.avg_sleep_duration_time! % 60}分钟
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最短时间</div>
                    <div className={styles.value} style={{ color: "#ff4d4f" }}>
                      {Math.floor(analysisData.min_sleep_duration_time! / 60)}
                      小时
                      {analysisData.min_sleep_duration_time! % 60}分钟
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={styles.chartCard}>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  <ReactECharts
                    option={getSleepTimeStats(analysisData)}
                    style={{ height: "400px" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
                <div className={styles.statsPanel}>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最早入睡</div>
                    <div className={styles.value}>
                      {analysisData.earliest_sleep_time}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>平均入睡</div>
                    <div className={styles.value}>
                      {analysisData.avg_start_sleep_time}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className={styles.chartCard}>
              <div className={styles.chartContainer}>
                <div className={styles.chart}>
                  <ReactECharts
                    option={getWakeUpTimeStats(analysisData)}
                    style={{ height: "400px" }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
                <div className={styles.statsPanel}>
                  <div className={styles.statItem}>
                    <div className={styles.label}>最晚起床</div>
                    <div className={styles.value}>
                      {analysisData.latest_wakeUp_time}
                    </div>
                  </div>
                  <div className={styles.statItem}>
                    <div className={styles.label}>平均起床</div>
                    <div className={styles.value}>
                      {analysisData.avg_wakeUp_time}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </Card>
    </div>
  );
};

export default Analysis;
