import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
  Statistic,
} from "antd";
import type { DatePickerProps } from "antd/es/date-picker";
import type { ColumnsType } from "antd/es/table";
import ReactECharts from "echarts-for-react";
import { useChartConfig } from "../../hooks/useChartConfig";
import dayjs from "dayjs";

type ReportType = "daily" | "weekly" | "monthly";

interface AnalysisData {
  date: string;
  avgHeartRate: number;
  avgRespirationRate: number;
  avgHealthScore: number;
  abnormalCount: number;
}

const Analysis: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [analysisType, setAnalysisType] = useState<ReportType>("daily");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const { echartsOption } = useChartConfig();

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
  const loadAnalysisData = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      // 根据报告类型确定数据长度和起始日期
      const dataLength = {
        daily: 24, // 日报告显示24小时的数据
        weekly: 7,
        monthly: selectedDate.daysInMonth(),
      }[analysisType];

      let startDate = selectedDate;
      if (analysisType === "daily") {
        // 日报告从当天0点开始
        startDate = selectedDate.startOf("day");
      } else if (analysisType === "weekly") {
        startDate = selectedDate.startOf("week");
      } else if (analysisType === "monthly") {
        startDate = selectedDate.startOf("month");
      }

      // 生成模拟数据
      const mockData: AnalysisData[] = Array.from(
        { length: dataLength },
        (_, i) => {
          let date;
          if (analysisType === "daily") {
            // 日报告按小时递增
            date = startDate.add(i, "hour").toDate();
          } else {
            // 周报告和月报告按天递增
            date = startDate.add(i, "day").toDate();
          }

          return {
            date:
              analysisType === "daily"
                ? date.toLocaleString() // 修改为显示完整的日期时间格式
                : date.toLocaleDateString(), // 周报告和月报告显示日期
            avgHeartRate: 70 + Math.random() * 10,
            avgRespirationRate: 16 + Math.random() * 4,
            avgHealthScore: 80 + Math.random() * 20,
            abnormalCount: Math.floor(Math.random() * 5),
          };
        }
      );
      setAnalysisData(mockData);
    } catch (error) {
      console.error("加载分析数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取当前报告类型对应的DatePicker配置
  const getDatePickerProps = (): DatePickerProps => {
    const baseProps: DatePickerProps = {
      onChange: handleDateChange,
      value: selectedDate,
      allowClear: true,
      style: { width: 200 },
      disabledDate: (current) => current && current.isAfter(dayjs()),
    };

    switch (analysisType) {
      case "daily":
        return baseProps;
      case "weekly":
        return { ...baseProps, picker: "week" as const };
      case "monthly":
        return { ...baseProps, picker: "month" as const };
      default:
        return baseProps;
    }
  };

  // 表格列定义
  const columns: ColumnsType<AnalysisData> = [
    {
      title: analysisType === "daily" ? "时间" : "日期",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "平均心率",
      dataIndex: "avgHeartRate",
      key: "avgHeartRate",
      render: (value: number) => value.toFixed(1),
    },
    {
      title: "平均呼吸率",
      dataIndex: "avgRespirationRate",
      key: "avgRespirationRate",
      render: (value: number) => value.toFixed(1),
    },
    {
      title: "平均健康评分",
      dataIndex: "avgHealthScore",
      key: "avgHealthScore",
      render: (value: number) => value.toFixed(1),
    },
    {
      title: "异常次数",
      dataIndex: "abnormalCount",
      key: "abnormalCount",
    },
  ];

  // 图表配置
  const chartOption = {
    ...echartsOption,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    xAxis: {
      type: "category",
      data: analysisData.map((item) => item.date),
      axisLabel: {
        interval: analysisType === "daily" ? 2 : 0,
        rotate: analysisType === "daily" ? 45 : 0,
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "10%",
      containLabel: true,
    },
    series: [
      {
        name: "平均心率",
        type: "line",
        smooth: true,
        data: analysisData.map((item) => [item.date, item.avgHeartRate]),
        symbolSize: 6,
      },
      {
        name: "平均呼吸率",
        type: "line",
        smooth: true,
        data: analysisData.map((item) => [item.date, item.avgRespirationRate]),
        symbolSize: 6,
      },
      {
        name: "健康评分",
        type: "line",
        smooth: true,
        data: analysisData.map((item) => [item.date, item.avgHealthScore]),
        symbolSize: 6,
      },
    ],
  };

  // 计算统计数据
  const statistics = {
    avgHeartRate:
      analysisData.reduce((sum, item) => sum + item.avgHeartRate, 0) /
      (analysisData.length || 1),
    avgRespirationRate:
      analysisData.reduce((sum, item) => sum + item.avgRespirationRate, 0) /
      (analysisData.length || 1),
    avgHealthScore:
      analysisData.reduce((sum, item) => sum + item.avgHealthScore, 0) /
      (analysisData.length || 1),
    totalAbnormal: analysisData.reduce(
      (sum, item) => sum + item.abnormalCount,
      0
    ),
  };

  return (
    <div>
      <Card title="数据分析">
        <Space style={{ marginBottom: 16 }}>
          <Select
            value={analysisType}
            onChange={handleAnalysisTypeChange}
            style={{ width: 120 }}
            options={[
              { label: "日报告", value: "daily" },
              { label: "周报告", value: "weekly" },
              { label: "月报告", value: "monthly" },
            ]}
          />
          <DatePicker {...getDatePickerProps()} />
          <Button
            type="primary"
            onClick={loadAnalysisData}
            disabled={!selectedDate}
          >
            生成分析
          </Button>
        </Space>

        {analysisData.length > 0 && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均心率"
                    value={statistics.avgHeartRate}
                    precision={1}
                    suffix="BPM"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均呼吸率"
                    value={statistics.avgRespirationRate}
                    precision={1}
                    suffix="次/分"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="平均健康评分"
                    value={statistics.avgHealthScore}
                    precision={1}
                    suffix="/100"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="异常次数"
                    value={statistics.totalAbnormal}
                    suffix="次"
                  />
                </Card>
              </Col>
            </Row>

            <Card type="inner" title="趋势分析" style={{ marginBottom: 16 }}>
              <ReactECharts
                option={chartOption}
                style={{ height: "400px" }}
                notMerge={true}
              />
            </Card>

            <Table
              columns={columns}
              dataSource={analysisData}
              rowKey="date"
              loading={loading}
              pagination={false}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Analysis;
