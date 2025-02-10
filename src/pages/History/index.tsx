import React, { useState } from "react";
import { Card, DatePicker, Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import ReactECharts from "echarts-for-react";
import { useChartConfig } from "../../hooks/useChartConfig";
import type { DatePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

interface HistoryRecord {
  id: string;
  timestamp: number;
  heartRate: number;
  respirationRate: number;
  healthScore: number;
}

const History: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { echartsOption } = useChartConfig();

  // 表格列定义
  const columns: ColumnsType<HistoryRecord> = [
    {
      title: "时间",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "心率(BPM)",
      dataIndex: "heartRate",
      key: "heartRate",
    },
    {
      title: "呼吸率(次/分)",
      dataIndex: "respirationRate",
      key: "respirationRate",
    },
    {
      title: "健康评分",
      dataIndex: "healthScore",
      key: "healthScore",
    },
  ];

  // 加载历史数据
  const loadHistoryData = async (date: Date) => {
    setLoading(true);
    try {
      // 将日期设置为当天的0点
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      // 生成模拟数据
      const mockData: HistoryRecord[] = Array.from({ length: 24 }, (_, i) => ({
        id: `record-${i}`,
        timestamp: startDate.getTime() + i * 3600000, // 从0点开始，每小时一条数据
        heartRate: 60 + Math.random() * 20,
        respirationRate: 15 + Math.random() * 5,
        healthScore: 70 + Math.random() * 30,
      }));
      setHistoryData(mockData);
    } catch (error) {
      console.error("加载历史数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理日期选择
  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (date) {
      const selectedDate = date.toDate();
      // 将选择的日期设置为当天的0点
      selectedDate.setHours(0, 0, 0, 0);
      setSelectedDate(selectedDate);
      loadHistoryData(selectedDate);
    } else {
      setSelectedDate(null);
      setHistoryData([]);
    }
  };

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
      data: historyData.map((record) =>
        new Date(record.timestamp).toLocaleString()
      ),
      axisLabel: {
        interval: 2,
        rotate: 45,
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
        name: "心率",
        type: "line",
        smooth: true,
        data: historyData.map((record) => [
          new Date(record.timestamp).toLocaleString(),
          record.heartRate,
        ]),
        symbolSize: 6,
      },
      {
        name: "呼吸率",
        type: "line",
        smooth: true,
        data: historyData.map((record) => [
          new Date(record.timestamp).toLocaleString(),
          record.respirationRate,
        ]),
        symbolSize: 6,
      },
      {
        name: "健康评分",
        type: "line",
        smooth: true,
        data: historyData.map((record) => [
          new Date(record.timestamp).toLocaleString(),
          record.healthScore,
        ]),
        symbolSize: 6,
      },
    ],
  };

  return (
    <div>
      <Card title="历史记录查询">
        <Space style={{ marginBottom: 16 }}>
          <DatePicker
            onChange={handleDateChange}
            disabledDate={(current) => current && current.isAfter(dayjs())}
          />
          <Button
            type="primary"
            onClick={() => selectedDate && loadHistoryData(selectedDate)}
            disabled={!selectedDate}
          >
            刷新数据
          </Button>
        </Space>

        {historyData.length > 0 && (
          <>
            <Card type="inner" title="历史趋势图" style={{ marginBottom: 16 }}>
              <ReactECharts
                option={chartOption}
                style={{ height: "400px" }}
                notMerge={true}
              />
            </Card>

            <Table
              columns={columns}
              dataSource={historyData}
              rowKey="id"
              loading={loading}
              pagination={false}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default History;
