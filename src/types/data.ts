/**
 * 设备日数据请求参数接口
 */
export interface DailyDataParams {
  /** 查询日期 */
  date?: string;
  /** 设备编码 */
  deviceCode?: string;
  /** 用户ID */
  userId?: number;
  /** 允许其他字段 */
  [property: string]: any;
}

/**
 * 设备范围统计数据请求参数接口
 */
export interface RangeDataParams {
  /** 设备编码 */
  deviceCode?: string;
  /** 结束日期 */
  endDate?: string;
  /** 开始日期 */
  startDate?: string;
  /** 用户ID */
  userId?: number;
  /** 允许其他字段 */
  [property: string]: any;
}
