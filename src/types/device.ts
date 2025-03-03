/**
 * 设备类型
 */
export interface Device {
  /** 设备编码 */
  deviceCode?: string;
  /** 设备名称 */
  deviceName?: string;
  /** 设备类型，目前只有 bcg 类型 */
  deviceType?: "bcg";
  /** 允许其他字段 */
  [property: string]: any;
}
