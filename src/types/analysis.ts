/**
 * 睡眠分析数据接口
 */
export interface AnalysisData {
  /** 日期 */
  date: string;
  /** 睡眠评分 */
  sleepScore: number;
  /** 睡眠阶段 */
  sleepStages: {
    /** 浅睡时长(分钟) */
    lightSleep: number;
    /** 深睡时长(分钟) */
    deepSleep: number;
    /** REM时长(分钟) */
    remSleep: number;
  };
  /** 入睡时间 */
  sleepTime: string;
  /** 醒来时间 */
  wakeTime: string;
}

/**
 * 异常统计接口
 */
export interface AnomalyStats {
  /** 心率异常次数 */
  heartRateAnomalies: number;
  /** 睡眠时长异常次数 */
  sleepDurationAnomalies: number;
  /** 睡眠质量异常次数 */
  sleepQualityAnomalies: number;
  /** 睡眠模式异常次数 */
  sleepPatternAnomalies: number;
  /** 总记录数 */
  totalRecords: number;
}

/**
 * 健康建议接口
 */
export interface HealthAdvice {
  /** 建议类型 */
  type: "success" | "info" | "warning" | "error";
  /** 建议标题 */
  message: string;
  /** 建议详情 */
  description: string;
}

/**
 * 睡眠阶段类型
 */
export type SleepStageType = "awake" | "light" | "deep" | "rem";

/**
 * 睡眠阶段接口
 */
export interface SleepStage {
  /** 阶段类型 */
  stage: SleepStageType;
  /** 持续时间(分钟) */
  duration: number;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
}

/**
 * 睡眠分析历史数据接口
 */
export interface SleepAnalysisData {
  /** 记录ID */
  id: string;
  /** 用户ID */
  userId: string;
  /** 开始时间 */
  startTime: string;
  /** 结束时间 */
  endTime: string;
  /** 持续时间(分钟) */
  duration: number;
  /** 睡眠质量评分 */
  quality: number;
  /** 睡眠阶段数据 */
  stages: SleepStage[];
}
