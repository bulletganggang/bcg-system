/**
 * 睡眠数据接口
 */
export interface SleepData {
  /** 睡眠结束时间戳 */
  sleep_end_time: number;
  /** 睡眠质量评分 */
  sleep_quality_score: number;
  /** 呼吸率数据 */
  respiratory_rate: {
    /** 最小呼吸率 */
    minimum_bpm: number;
    /** 平均呼吸率 */
    average_bpm: number;
    /** 最大呼吸率 */
    maximum_bpm: number;
  };
  /** 睡眠总结数据 */
  sleep_summary_data: {
    /** 浅睡总时长（分钟） */
    light_sleep_overall_minutes: number;
    /** 总睡眠时长（分钟） */
    total_sleep_duration_minutes: number;
    /** REM睡眠总时长（分钟） */
    rem_sleep_overall_minutes: number;
    /** 深睡总时长（分钟） */
    deep_sleep_overall_minutes: number;
    /** 清醒时长（分钟） */
    awake_time: number;
  };
  /** 睡眠建议 */
  sleep_suggestion: string[];
  /** 睡眠开始时间戳 */
  sleep_start_time: number;
  /** 睡眠阶段数据 */
  sleep_stages: Array<{
    /** 睡眠阶段 */
    stage: "Light Sleep" | "Deep Sleep" | "REM Sleep";
    /** 时间戳 */
    timestamp: number;
  }>;
  /** 设备编码 */
  device_code: string;
  /** 设备类型 */
  device_type: string;
  /** 记录时间戳 */
  timestamp: number;
}
