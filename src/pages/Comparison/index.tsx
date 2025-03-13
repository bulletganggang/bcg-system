import React, { useState, useCallback } from "react";
import {
  Card,
  Space,
  DatePicker,
  Tabs,
  Empty,
  Spin,
  Row,
  Col,
  message,
} from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { getDailyData } from "@/api";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { DatePickerProps } from "antd";
import ReactECharts from "echarts-for-react";
import {
  getQualityComparisonOption,
  getDurationComparisonOption,
  getStageComparisonOption,
  getHealthStandardOption,
  getMovementComparisonOption,
} from "@/configs/charts/comparison";
import ComparisonReport from "./components/ComparisonReport";
import styles from "./style.module.scss";
import { ComparisonData } from "@/types";

const Comparison: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [date1, setDate1] = useState<Dayjs | null>(null);
  const [date2, setDate2] = useState<Dayjs | null>(null);
  const { currentDevice } = useSelector((state: RootState) => state.device);
  const { userId } = useSelector((state: RootState) => state.user);

  // 加载对比数据
  const loadComparisonData = useCallback(
    async (dates: Dayjs[]) => {
      if (!currentDevice?.deviceCode) return;

      try {
        setLoading(true);
        setError(null);
        const promises = dates.map((date) =>
          getDailyData({
            date: date.format("YYYY-MM-DD"),
            deviceCode: currentDevice.deviceCode,
            userId,
          })
        );

        const responses = await Promise.all(promises);
        const newData = responses.map((response, index) => {
          // 检查返回的数据是否有效
          if (!response.data || !response.data.sleep_quality_score) {
            throw new Error(
              `${dates[index].format("YYYY-MM-DD")} 的数据不完整或无效`
            );
          }
          return {
            date: dates[index].format("YYYY-MM-DD"),
            data: response.data,
          };
        });

        setComparisonData(newData);
      } catch (error) {
        const err = error as Error;
        setError(err.message);
        message.error(err.message);
        setComparisonData([]);
      } finally {
        setLoading(false);
      }
    },
    [currentDevice?.deviceCode, userId]
  );

  // 处理日期选择
  const handleDateChange = (
    date: Dayjs | null,
    dateType: "date1" | "date2"
  ) => {
    if (dateType === "date1") {
      setDate1(date);
    } else {
      setDate2(date);
    }

    // 如果两个日期都已选择，则加载数据
    if (dateType === "date1" && date && date2) {
      loadComparisonData([date, date2]);
    } else if (dateType === "date2" && date && date1) {
      loadComparisonData([date1, date]);
    }
  };

  // 日期禁用函数
  const disabledDate1: DatePickerProps["disabledDate"] = (current) => {
    if (!current) return false;
    return (
      current.isAfter(dayjs().endOf("day")) ||
      (date2 ? current.isAfter(date2) : false)
    );
  };

  const disabledDate2: DatePickerProps["disabledDate"] = (current) => {
    if (!current) return false;
    return (
      current.isAfter(dayjs().endOf("day")) ||
      (date1 ? current.isBefore(date1) : false)
    );
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

    if (error) {
      return (
        <Empty
          description={
            <div className={styles.emptyText}>
              <p>加载数据失败</p>
              <p>{error}</p>
            </div>
          }
        />
      );
    }

    return (
      <Empty
        description={
          <div className={styles.emptyText}>
            <p>暂无对比数据</p>
            <p>请选择两个日期进行对比</p>
          </div>
        }
      />
    );
  };

  const tabItems = [
    {
      key: "timeComparison",
      label: "睡眠数据对比",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="睡眠质量对比">
              <ReactECharts
                option={getQualityComparisonOption(comparisonData)}
                style={{ height: "400px" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="睡眠时长对比">
              <ReactECharts
                option={getDurationComparisonOption(comparisonData)}
                style={{ height: "400px" }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="睡眠阶段对比">
              <ReactECharts
                option={getStageComparisonOption(comparisonData)}
                style={{ height: "400px" }}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="体动数据对比">
              <ReactECharts
                option={getMovementComparisonOption(comparisonData)}
                style={{ height: "400px" }}
              />
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "standardComparison",
      label: "健康标准对比",
      children: (
        <Card title="与健康标准对比">
          <ReactECharts
            option={getHealthStandardOption(comparisonData)}
            style={{ height: "600px" }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className={styles.comparisonContainer}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card
          title="数据对比"
          extra={
            <Space>
              <DatePicker
                onChange={(date) => handleDateChange(date, "date1")}
                value={date1}
                placeholder="选择第一天"
                disabledDate={disabledDate1}
              />
              <DatePicker
                onChange={(date) => handleDateChange(date, "date2")}
                value={date2}
                placeholder="选择第二天"
                disabledDate={disabledDate2}
              />
            </Space>
          }
        >
          {loading ? (
            <div className={styles.loadingContainer}>
              <Spin size="large" />
            </div>
          ) : !comparisonData.length ? (
            renderEmptyState()
          ) : (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <ComparisonReport comparisonData={comparisonData} />
              <Tabs items={tabItems} />
            </Space>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default Comparison;
