import request from "@/utils/request";
import { API_PATHS } from "@/constants/api";
import type { DailyDataParams, RangeDataParams } from "@/types";

/**
 * 获取日常数据
 * @param params 查询参数
 */
export const getDailyData = (params: DailyDataParams) => {
  return request("get", API_PATHS.DATA.DAILY, params);
};

/**
 * 获取范围数据（周/月）
 * @param params 查询参数
 */
export const getRangeData = (params: RangeDataParams) => {
  return request("get", API_PATHS.DATA.RANGE, params);
};
