/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户名 */
  name: string;
  /** 头像URL */
  avatar?: string;
  /** 手机号 */
  phone: string;
  /** 性别（1: 男，0: 女） */
  gender?: 0 | 1;
  /** 体重(kg) */
  weight?: number;
  /** 身高(cm) */
  height?: number;
  /** 生日 */
  birthday?: string;
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
