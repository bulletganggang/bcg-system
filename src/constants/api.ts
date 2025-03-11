/**
 * API 接口配置
 * useData: true 表示使用 request body 传递数据
 * useData: false/undefined 表示使用 URL params 传递数据
 */
export const API_CONFIG = {
  // 用户相关接口
  "/user/login": { useData: true }, // 登录
  "/user/change/avatar": { useData: true }, // 登录
} as const;

export type ApiConfigKey = keyof typeof API_CONFIG;

/**
 * API 接口路径
 */
export const API_PATHS = {
  USER: {
    LOGIN: "/user/login",
    LOGOUT: "/user/logout",
    PROFILE: "/user/user-profile",
    UPDATE: "/user/update",
    CHANGE_AVATAR: "/user/change/avatar",
    SMS_CODE: "/user/smscode",
  },
  DEVICE: {
    BIND: "/device/bind",
    UNBIND: "/device/unbind",
    LIST: "/device/user-query",
  },
  DATA: {
    DAILY: "/data/daily",
    RANGE: "/data/range",
  },
  // 可以添加其他模块的接口路径
} as const;
