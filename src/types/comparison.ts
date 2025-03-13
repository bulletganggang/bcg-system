import type { SleepData } from "./sleep";

/**
 * 对比数据接口
 */
export interface ComparisonData {
  /** 日期 */
  date: string;
  /** 睡眠数据 */
  data: SleepData;
}
