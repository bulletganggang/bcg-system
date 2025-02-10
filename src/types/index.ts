/**
 * BCG信号数据接口
 */
export interface BCGData {
  /** 时间戳 */
  timestamp: number;
  /** BCG信号值 */
  value: number;
  /** 数据标识 */
  id: string;
}

/**
 * 健康状态接口
 */
export interface HealthStatus {
  /** 心率 */
  heartRate: number;
  /** 呼吸率 */
  respirationRate: number;
  /** 健康评分 */
  healthScore: number;
  /** 异常警告 */
  warnings?: string[];
}

/**
 * 用户配置接口
 */
export interface UserConfig {
  /** 采样率 */
  sampleRate: number;
  /** 显示时间范围(秒) */
  timeRange: number;
  /** 是否显示网格 */
  showGrid: boolean;
  /** 是否自动缩放 */
  autoScale: boolean;
}

/**
 * WebSocket消息类型
 */
export enum WebSocketMessageType {
  /** BCG数据 */
  BCG_DATA = "BCG_DATA",
  /** 健康状态 */
  HEALTH_STATUS = "HEALTH_STATUS",
  /** 系统消息 */
  SYSTEM_MESSAGE = "SYSTEM_MESSAGE",
  /** 错误消息 */
  ERROR = "ERROR",
}

/**
 * WebSocket消息接口
 */
export interface WebSocketMessage {
  /** 消息类型 */
  type: WebSocketMessageType;
  /** 消息数据 */
  data: BCGData | HealthStatus | string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 图表配置接口
 */
export interface ChartConfig {
  /** 图表类型 */
  type: "line" | "bar" | "scatter";
  /** 是否显示标签 */
  showLabel: boolean;
  /** 是否允许缩放 */
  zoomable: boolean;
}

/**
 * API响应接口
 */
export interface ApiResponse<T> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 数据 */
  data: T;
}
