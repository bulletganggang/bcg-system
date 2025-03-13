import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Empty,
  Spin,
  Space,
} from "antd";
import {
  StarFilled,
  ClockCircleFilled,
  RiseOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd/es/date-picker";
import styles from "./style.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { getDailyData } from "@/api";
import type { RootState, AppDispatch } from "@/store";
import type { SleepData } from "@/types";
import {
  getSleepStageOption,
  getSleepSummaryOption,
} from "@/configs/charts/sleep";
import ExportButton from "@/components/ExportButton";
import SleepQualityAssessment from "@/components/SleepQualityAssessment";
import RespiratoryRateAlert from "@/components/RespiratoryRateAlert";
import {
  prepareExportData,
  getExportFileName,
} from "@/utils/pdf-sheet-export/sleep";
import { addRecord } from "@/store/slices/alertSlice";
import { checkAlertRules } from "@/utils/alert-utils";

const Sleep: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [sleepData, setSleepData] = useState<SleepData | null>(null);
  const currentDevice = useSelector(
    (state: RootState) => state.device.currentDevice
  );
  const { userId } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const { rules, records } = useSelector((state: RootState) => state.alert);

  // 加载睡眠数据
  const loadSleepData = useCallback(
    async (date: dayjs.Dayjs) => {
      if (!currentDevice?.deviceCode) {
        return;
      }

      try {
        setLoading(true);
        const response = await getDailyData({
          date: date.format("YYYY-MM-DD"),
          deviceCode: currentDevice.deviceCode,
          userId,
        });
        setSleepData(response.data);

        // 在数据加载完成后进行预警检测
        if (response.data) {
          const triggeredAlerts = checkAlertRules(
            response.data,
            rules,
            records
          );
          triggeredAlerts.forEach((alert) => dispatch(addRecord(alert)));
        }
      } catch (error) {
        console.error("加载睡眠数据失败:", error);
        setSleepData(null);
      } finally {
        setLoading(false);
      }
    },
    [currentDevice?.deviceCode, userId, rules, records, dispatch]
  );

  // 首次加载和设备变化时加载数据
  useEffect(() => {
    loadSleepData(selectedDate);
  }, [selectedDate, loadSleepData, currentDevice]);

  // 处理日期选择
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      setSelectedDate(date);
    }
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
      return null; // 加载中不显示空状态
    }

    return (
      <Empty
        description={
          <div className={styles.emptyText}>
            <p>暂无睡眠数据</p>
            <p>请选择其他日期查看</p>
          </div>
        }
      />
    );
  };

  return (
    <div className={styles.sleepContainer}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* 日期选择器卡片 */}
        <Card
          title="睡眠数据"
          extra={
            <Space size="middle">
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                disabledDate={(current) => current && current.isAfter(dayjs())}
                allowClear={false}
              />
              <ExportButton
                excelData={prepareExportData(sleepData)}
                fileNamePrefix={getExportFileName(selectedDate)}
                disabled={!sleepData || loading}
              />
            </Space>
          }
        >
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          ) : !sleepData ? (
            renderEmptyState()
          ) : (
            <Row gutter={[16, 16]} className={styles.statsRow}>
              <Col span={6}>
                <Statistic
                  title={
                    <Space>
                      <StarFilled style={{ color: "#1890ff" }} />
                      睡眠评分
                    </Space>
                  }
                  value={sleepData.sleep_quality_score}
                  suffix="/ 100"
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={
                    <Space>
                      <ClockCircleFilled style={{ color: "#52c41a" }} />
                      入睡时间
                    </Space>
                  }
                  value={dayjs(sleepData.sleep_start_time * 1000).format(
                    "HH:mm"
                  )}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={
                    <Space>
                      <RiseOutlined style={{ color: "#722ed1" }} />
                      醒来时间
                    </Space>
                  }
                  value={dayjs(sleepData.sleep_end_time * 1000).format("HH:mm")}
                  valueStyle={{ color: "#722ed1" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title={
                    <Space>
                      <FieldTimeOutlined style={{ color: "#fa8c16" }} />
                      总睡眠时长
                    </Space>
                  }
                  value={`${Math.floor(
                    sleepData.sleep_summary_data.total_sleep_duration_minutes /
                      60
                  )}小时${
                    sleepData.sleep_summary_data.total_sleep_duration_minutes %
                    60
                  }分钟`}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Col>
            </Row>
          )}
        </Card>

        {!loading && sleepData && (
          <>
            {/* 睡眠分析卡片 */}
            <Card title="睡眠分析">
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card
                    title={
                      <Space>
                        <span className={styles.cardIcon}>📈</span>
                        睡眠阶段变化
                      </Space>
                    }
                    bordered={false}
                  >
                    <ReactECharts
                      option={getSleepStageOption(sleepData)}
                      style={{ height: "400px" }}
                    />
                  </Card>
                </Col>
                <Col span={16}>
                  <Card
                    title={
                      <Space>
                        <span className={styles.cardIcon}>🌙</span>
                        睡眠时长分布
                      </Space>
                    }
                    bordered={false}
                  >
                    <div className={styles.sleepSummaryContainer}>
                      <div className={styles.awakeCount}>
                        <Statistic
                          title="清醒次数"
                          value={sleepData.sleep_summary_data.awake_time}
                          suffix="次"
                        />
                      </div>
                      <ReactECharts
                        option={getSleepSummaryOption(sleepData)}
                        style={{ height: "400px" }}
                      />
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card
                    title={
                      <Space>
                        <span className={styles.cardIcon}>🫁</span>
                        呼吸频率监测
                      </Space>
                    }
                    bordered={false}
                  >
                    <Space
                      direction="vertical"
                      size="large"
                      style={{ width: "100%" }}
                    >
                      <Statistic
                        title={
                          <Space>
                            <span className={styles.cardIcon}>⬇️</span>
                            最低呼吸率
                          </Space>
                        }
                        value={sleepData.respiratory_rate.minimum_bpm}
                        suffix="次/分钟"
                        valueStyle={{ color: "#3f8600" }}
                      />
                      <Statistic
                        title={
                          <Space>
                            <span className={styles.cardIcon}>➖</span>
                            平均呼吸率
                          </Space>
                        }
                        value={sleepData.respiratory_rate.average_bpm}
                        suffix="次/分钟"
                        valueStyle={{ color: "#1890ff" }}
                      />
                      <Statistic
                        title={
                          <Space>
                            <span className={styles.cardIcon}>⬆️</span>
                            最高呼吸率
                          </Space>
                        }
                        value={sleepData.respiratory_rate.maximum_bpm}
                        suffix="次/分钟"
                        valueStyle={{ color: "#722ed1" }}
                      />
                      <RespiratoryRateAlert
                        respiratoryRate={sleepData.respiratory_rate}
                      />
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* 睡眠质量评估 */}
            <SleepQualityAssessment sleepData={sleepData} />
          </>
        )}
      </Space>
    </div>
  );
};

export default Sleep;
