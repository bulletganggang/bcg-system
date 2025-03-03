import request from "@/utils/request";
import { API_PATHS } from "@/constants/api";
import type { ValidLoginParams, UserInfo, UpdateUserInfo } from "@/types";

/**
 * 用户登录
 * @param params 登录参数
 */
export const login = (params: ValidLoginParams) => {
  return request<UserInfo>("post", API_PATHS.USER.LOGIN, params);
};

/**
 * 获取用户信息
 */
export const getProfile = () => {
  return request<UserInfo>("get", API_PATHS.USER.PROFILE);
};

/**
 * 更新用户信息
 * @param params 用户信息
 * @param id 用户ID
 */
export const updateProfile = (params: UpdateUserInfo, id: number) => {
  return request<UserInfo>("post", API_PATHS.USER.UPDATE, { ...params, id });
};

/**
 * 修改头像
 * @param file 头像文件
 */
export const changeAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return request<string>("post", API_PATHS.USER.CHANGE_AVATAR, formData);
};

/**
 * 发送短信验证码
 * @param phone 手机号
 */
export const sendSmsCode = (phone: string) => {
  return request("post", API_PATHS.USER.SMS_CODE, { phone });
};

/**
 * 退出登录
 */
export const logout = () => {
  return request("post", API_PATHS.USER.LOGOUT);
};
