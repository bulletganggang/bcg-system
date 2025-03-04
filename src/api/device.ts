import request from "@/utils/request";
import { API_PATHS } from "@/constants/api";
import type { Device } from "@/types";

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
