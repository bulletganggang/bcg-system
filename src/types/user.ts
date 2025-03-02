/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID，唯一标识 */
  userId?: number;
  /** 用户名 可重复 */
  username?: string;
  /** 用户头像URL */
  avatar?: string;
  /** 用户手机号码 */
  phone?: string;
  /** 性别 0 未定义 1 男 2 女 */
  gender?: number;
  /** 体重 */
  weight?: number;
  /** 身高 */
  height?: number;
  /** 生日 */
  birthday?: string;
  /** 用户角色 0-admin 1-user */
  role?: number;
  /** 是否首次登录 */
  isFirstLogin?: number;
  [property: string]: any;
}

/**
 * 登录参数接口
 */
export interface LoginParams {
  /** 手机号 */
  phone: string;
  /** 密码 */
  password?: string;
  /** 验证码 */
  code?: string;
}

// 确保 password 和 code 二选一
export type ValidLoginParams =
  | (LoginParams & { password: string; code?: never })
  | (LoginParams & { password?: never; code: string });

/**
 * 登录响应接口
 */
export interface LoginResponse {
  /** JWT token */
  token: string;
  /** 用户信息 */
  userInfo: UserInfo;
}
