import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ReactECharts from "echarts-for-react";
import {
  HeartOutlined,
  ThunderboltOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { useBCGData } from "../../hooks/useBCGData";
import { useChartConfig } from "../../hooks/useChartConfig";
import type { RootState } from "../../store";
import {
  setConnected,
  addBCGData,
  updateHealthStatus,
} from "../../store/slices/bcgSlice";

const Monitor: React.FC = () => {
  const dispatch = useDispatch();
  const { bcgData, healthStatus, isConnected } = useBCGData({
    wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:8080",
  });

  const { echartsOption } = useChartConfig();
  // 从Redux获取状态
  const connected = useSelector((state: RootState) => state.bcg?.connected);
  const error = useSelector((state: RootState) => state.bcg?.error);

  // 更新连接状态
  useEffect(() => {
    dispatch(setConnected(isConnected));
  }, [isConnected, dispatch]);

  // 处理数据更新
  useEffect(() => {
    if (bcgData.length > 0) {
      const lastData = bcgData[bcgData.length - 1];
      dispatch(addBCGData(lastData));
    }
  }, [bcgData, dispatch]);

  // 处理健康状态更新
  useEffect(() => {
    if (healthStatus) {
      dispatch(updateHealthStatus(healthStatus));
    }
  }, [healthStatus, dispatch]);

  // 图表数据
  const chartData = {
    ...echartsOption,
    series: [
      {
        ...(Array.isArray(echartsOption.series) ? echartsOption.series[0] : echartsOption.series),
        data: bcgData.map((item) => [item.timestamp, item.value]),
      },
    ],
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 状态卡片 */}
        <Col span={8}>
          <Card>
            <Statistic
              title="心率"
              value={healthStatus?.heartRate || 0}
              prefix={<HeartOutlined />}
              suffix="BPM"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="呼吸率"
              value={healthStatus?.respirationRate || 0}
              prefix={<ThunderboltOutlined />}
              suffix="次/分"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="健康评分"
              value={healthStatus?.healthScore || 0}
              prefix={<DashboardOutlined />}
              suffix="/100"
            />
          </Card>
        </Col>
      </Row>

      {/* 连接状态提示 */}
      {!connected && (
        <Alert
          message="连接断开"
          description="正在尝试重新连接到服务器..."
          type="warning"
          showIcon
          style={{ margin: "16px 0" }}
        />
      )}

      {/* 错误提示 */}
      {error && (
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
          style={{ margin: "16px 0" }}
        />
      )}

      {/* BCG波形图 */}
      <Card title="BCG实时波形" style={{ marginTop: 16 }}>
        <ReactECharts
          option={chartData}
          style={{ height: "400px" }}
          notMerge={true}
        />
      </Card>

      {/* 健康警告 */}
      {healthStatus?.warnings && healthStatus.warnings.length > 0 && (
        <Alert
          message="健康警告"
          description={
            <ul>
              {healthStatus.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};

export default Monitor;
