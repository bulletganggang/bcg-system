import axios, { AxiosRequestConfig, Method } from "axios";
import { message } from "antd";
import { store } from "../store";
import { clearUserInfo } from "../store/slices/userSlice";
import { ApiResponse, RequestParams } from "@/types";
import { API_CONFIG, ApiConfigKey } from "@/constants/api";

// 创建 axios 实例
const instance = axios.create({
  // 开发环境使用相对路径（由 vite 代理处理），生产环境使用实际 API 地址
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true, // 允许跨域请求携带 cookie
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 由于使用 cookie 认证，这里不需要手动设置 token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 根据后端返回的状态码处理
    if (res.code === 0) {
      // 请求成功
      return res;
    }

    // 处理特定错误码
    switch (res.code) {
      case 40000:
        message.error(res.message || "请求参数错误");
        break;
      case 40100:
        // 未登录，清除用户信息并跳转到登录页
        store.dispatch(clearUserInfo());
        window.location.href = "/login";
        break;
      case 40101:
        message.error(res.message || "无权限访问");
        break;
      case 40400:
        message.error(res.message || "请求数据不存在");
        break;
      case 40300:
        message.error(res.message || "禁止访问");
        break;
      case 50000:
        message.error(res.message || "系统内部异常");
        break;
      default:
        message.error(res.message || "请求失败");
    }

    return Promise.reject(new Error(res.message || "Error"));
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除用户信息并跳转到登录页
          store.dispatch(clearUserInfo());
          window.location.href = "/login";
          break;
        case 403:
          message.error("没有权限访问该资源");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器错误，请稍后重试");
          break;
        default:
          message.error(error.response.data?.message || "请求失败");
      }
    } else {
      message.error("网络错误，请检查网络连接");
    }
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
export const request = async <T = any>(
  method: Method,
  url: string,
  data?: RequestParams,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const apiConfig = API_CONFIG[url as ApiConfigKey];
  const isGetRequest = method.toLowerCase() === "get";
  const shouldUseData = apiConfig?.useData === true;

  const options: AxiosRequestConfig = {
    method,
    url,
    ...(isGetRequest || !shouldUseData ? { params: data } : { data }),
    ...config,
  };

  try {
    return await instance.request(options);
  } catch (error) {
    throw error;
  }
};

export default request;
