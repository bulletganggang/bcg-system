/**
 * API响应基础接口
 */
export interface ApiResponse<T> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 数据 */
  data: T;
}

/**
 * 请求参数接口
 */
export interface RequestParams {
  [key: string]: any;
}
