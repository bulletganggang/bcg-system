import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { message } from "antd";

// 定义请求方法类型
type RequestMethod = "get" | "post" | "put" | "delete";

// 定义基础响应接口
export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 定义请求参数接口
export interface RequestParams {
  [key: string]: string | object | number | boolean | null | undefined;
}

// 创建 axios 实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // 从环境变量获取基础URL
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许携带 cookie
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里可以统一添加 token 等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    // 这里可以根据后端的数据结构进行调整
    if (data.code === 0) {
      return data.data;
    }
    message.error(data.message || "请求失败");
    return Promise.reject(new Error(data.message || "请求失败"));
  },
  (error) => {
    message.error(error.response.data.detail[0].msg || "服务异常");
    return Promise.reject(error);
  }
);

/**
 * 统一请求方法
 * @param method 请求方法
 * @param url 请求地址
 * @param data 请求数据
 * @param config 额外配置
 * @returns Promise
 */
export const request = <TResponse>(
  method: RequestMethod,
  url: string,
  data?: RequestParams,
  config?: AxiosRequestConfig
): Promise<TResponse> => {
  const configs = {
    ...config,
    method,
    url,
  };

  // GET 和 DELETE 请求参数放在 params 中
  if (method === "get" || method === "delete") {
    configs.params = data;
  } else {
    // POST 和 PUT 请求参数放在 data 中
    configs.data = data;
  }

  return instance.request<BaseResponse<TResponse>, TResponse>(configs);
};

export default request;
