import { useState, useEffect, useCallback } from "react";
import { WebSocketClient } from "../utils/websocket";
import { BCGData, WebSocketMessageType, HealthStatus } from "../types";
import { message } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface UseBCGDataProps {
  /** WebSocket服务器地址 */
  wsUrl: string;
}

interface UseBCGDataReturn {
  /** BCG数据列表 */
  bcgData: BCGData[];
  /** 健康状态 */
  healthStatus: HealthStatus | null;
  /** 连接状态 */
  isConnected: boolean;
  /** 清除数据 */
  clearData: () => void;
  /** 重新连接 */
  reconnect: () => void;
}

/**
 * BCG数据处理Hook
 * @param props 配置参数
 * @returns Hook返回值
 */
export function useBCGData({ wsUrl }: UseBCGDataProps): UseBCGDataReturn {
  // 从Redux获取配置
  const { sampleRate, timeRange } = useSelector(
    (state: RootState) => state.config.userConfig
  );

  // 根据采样率和时间范围计算缓冲区大小
  const bufferSize = sampleRate * timeRange;

  const [bcgData, setBcgData] = useState<BCGData[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);

  // 处理BCG数据
  const handleBCGData = useCallback(
    (data: BCGData) => {
      setBcgData((prevData) => {
        const newData = [...prevData, data];
        // 保持数据量在bufferSize范围内
        return newData.length > bufferSize
          ? newData.slice(-bufferSize)
          : newData;
      });
    },
    [bufferSize]
  );

  // 处理健康状态数据
  const handleHealthStatus = useCallback((data: HealthStatus) => {
    setHealthStatus(data);
    // 检查是否有警告信息
    if (data.warnings && data.warnings.length > 0) {
      data.warnings.forEach((warning) => {
        message.warning(warning);
      });
    }
  }, []);

  // 初始化WebSocket连接
  useEffect(() => {
    const client = new WebSocketClient(wsUrl);

    // 添加消息处理器
    client.addMessageHandler(WebSocketMessageType.BCG_DATA, handleBCGData);
    client.addMessageHandler(
      WebSocketMessageType.HEALTH_STATUS,
      handleHealthStatus
    );

    // 连接WebSocket
    client.connect();
    setWsClient(client);
    setIsConnected(true);

    return () => {
      client.disconnect();
      setIsConnected(false);
    };
  }, [wsUrl, handleBCGData, handleHealthStatus]);

  // 清除数据
  const clearData = useCallback(() => {
    setBcgData([]);
    setHealthStatus(null);
  }, []);

  // 重新连接
  const reconnect = useCallback(() => {
    if (wsClient) {
      wsClient.disconnect();
      wsClient.connect();
    }
  }, [wsClient]);

  return {
    bcgData,
    healthStatus,
    isConnected,
    clearData,
    reconnect,
  };
}
