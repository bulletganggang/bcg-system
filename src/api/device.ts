import request from "@/utils/request";
import { API_PATHS } from "@/constants/api";
import type {
  Device,
  DailyDataParams,
  RangeDataParams,
  SleepData,
} from "@/types";

/**
 * 获取设备列表
 */
export const getDeviceList = () => {
  return request<Device[]>("get", API_PATHS.DEVICE.LIST);
};

/**
 * 绑定设备
 * @param deviceCode 设备编码
 * @param userId 用户ID
 */
export const bindDevice = (deviceCode: string, userId: number) => {
  return request<Device>("post", API_PATHS.DEVICE.BIND, { deviceCode, userId });
};

/**
 * 解绑设备
 * @param deviceCode 设备编码
 * @param userId 用户ID
 */
export const unbindDevice = (deviceCode: string, userId: number) => {
  return request<void>("post", API_PATHS.DEVICE.UNBIND, { deviceCode, userId });
};

/**
 * 获取设备日常数据
 * @param params 查询参数
 */
export const  getDailyData = (params: DailyDataParams) => {
  return request<SleepData>("get", API_PATHS.DATA.DAILY, params);
};

/**
 * 获取设备范围数据（周/月）
 * @param params 查询参数
 */
export const getRangeData = (params: RangeDataParams) => {
  return request("get", API_PATHS.DATA.RANGE, params);
};

/**
 * 获取设备历史数据列表
 * @param deviceCode 设备编码
 */
export const getHistoryList = (deviceCode: string) => {
  return request("get", API_PATHS.DATA.LIST, { deviceCode });
};
