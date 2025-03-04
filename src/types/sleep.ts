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
    /** 浅睡时长 */
    lightSleep: number;
    /** 深睡时长 */
    deepSleep: number;
    /** REM时长 */
    remSleep: number;
    /** 清醒时长 */
    awake: number;
  };
  /** 睡眠阶段 */
  sleepStages: Array<{
    /** 时间 */
    time: string;
    /** 阶段 */
    stage: "rem" | "light" | "deep" | "awake";
  }>;
  /** 呼吸率 */
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
  /** 活动数据 */
  activityData: {
    /** 静止时间 */
    inactiveTime: number;
    /** 活动时间 */
    activeTime: number;
    /** 体位变换时间 */
    positionChangeTime: number;
    /** 体动时间 */
    bodyMovementTime: number;
  };
}
