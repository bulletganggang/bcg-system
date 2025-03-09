/**
 * 睡眠分析数据接口
 */
export interface AnalysisData {
  /** 最晚醒来时间 */
  latest_wakeUp_time?: string;
  /** 时间戳列表 */
  timestamp_list?: number[];
  /** 设备类型 */
  device_type: string;
  /** 睡眠阶段时长列表 */
  sleep_stage_time_list?: Array<{
    /** 浅睡时长（分钟） */
    light_sleep_overall_minutes: number;
    /** REM睡眠时长（分钟） */
    rem_sleep_overall_minutes: number;
    /** 深睡时长（分钟） */
    deep_sleep_overall_minutes: number;
  }>;
  /** 睡眠时间分布列表 [开始时间戳, 结束时间戳][] */
  sleep_time_distribute_list?: [number, number][];
  /** 最长睡眠时长（分钟） */
  max_sleep_duration_time?: number;
  /** 睡眠评分列表 */
  sleep_score_list?: number[];
  /** 平均睡眠评分 */
  avg_sleep_score?: number;
  /** 最短睡眠时长（分钟） */
  min_sleep_duration_time?: number;
  /** 平均醒来时间 */
  avg_wakeUp_time?: string;
  /** 设备编码 */
  device_code: string;
  /** 最低睡眠评分 */
  min_sleep_score?: number;
  /** 最高睡眠评分 */
  max_sleep_score?: number;
  /** 平均睡眠时长（分钟） */
  avg_sleep_duration_time?: number;
  /** 平均入睡时间 */
  avg_start_sleep_time?: string;
  /** 最早入睡时间 */
  earliest_sleep_time?: string;
}

/**
 * 报告类型
 */
export type ReportType = "weekly" | "monthly";
