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

/**
 * 睡眠数据接口
 */
export interface SleepData {
  /** 日期 */
  date: string;
  /** 入睡时间 */
  sleepTime: string;
  /** 醒来时间 */
  wakeTime: string;
  /** 总睡眠时长 */
  totalSleepTime: string;
  /** 睡眠评分 */
  sleepScore: number;
  /** 睡眠结构 */
  sleepStructure: {
    /** 浅睡时长(分钟) */
    lightSleep: number;
    /** 深睡时长(分钟) */
    deepSleep: number;
    /** REM睡眠时长(分钟) */
    remSleep: number;
    /** 清醒时长(分钟) */
    awake: number;
  };
  /** 睡眠阶段 */
  sleepStages: Array<{
    /** 时间点 */
    time: string;
    /** 睡眠阶段 */
    stage: "rem" | "light" | "deep" | "awake";
  }>;
  /** 呼吸频率 */
  breathingRate: {
    /** 最大值 */
    max: number;
    /** 平均值 */
    avg: number;
    /** 最小值 */
    min: number;
  };
  /** 心率 */
  heartRate: {
    /** 最大值 */
    max: number;
    /** 平均值 */
    avg: number;
    /** 最小值 */
    min: number;
  };
  /** 体动数据 */
  activityData: {
    /** 不活跃时长(分钟) */
    inactiveTime: number;
    /** 活动时长(分钟) */
    activeTime: number;
    /** 体位改变时长(分钟) */
    positionChangeTime: number;
    /** 身体变动时长(分钟) */
    bodyMovementTime: number;
  };
}
