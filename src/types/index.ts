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

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

/**
 * 睡眠数据接口
 */
export interface SleepData {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  quality: number;
  stages: SleepStage[];
}

/**
 * 睡眠阶段接口
 */
export interface SleepStage {
  stage: "awake" | "light" | "deep" | "rem";
  duration: number;
  startTime: string;
  endTime: string;
}

/**
 * 分析数据接口
 */
export interface AnalysisData {
  date: string;
  sleepQuality: number;
  sleepDuration: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
}

/**
 * 配置选项接口
 */
export interface ConfigOptions {
  theme: "light" | "dark";
  language: "zh" | "en";
  notifications: boolean;
}
