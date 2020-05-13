import axios from 'axios';
import getConfig from 'next/config';
import { message } from 'antd';
import { isAxiosError } from './methods';

interface IRequestConfig {
  /**
   * http 请求方法
   */
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';

  /**
   * 请求头
   */
  headers?: Record<string, any>;

  /**
   * url 参数
   */
  params?: Record<string, any>;

  /**
   * body 参数
   */
  data?: Record<string, any>;

  timeout?: number;

  maxBodyLength?: any;

  maxContentLength?: any;
}

interface ICustomResponse<T = any> {
  /**
   * 后台定义的状态码
   */
  code: number;

  /**
   * 后台定义的 message
   */
  message: string;

  /**
   * 实际返回数据
   */
  data: T;
}

interface ICustomError {
  code: number;
  message: string;
  isAxiosError: boolean;
}

const { API_HOST } = getConfig().publicRuntimeConfig;

const instance = axios.create({ baseURL: API_HOST });

instance.defaults.maxContentLength = Infinity;

async function request<T>(url: string, config: IRequestConfig): Promise<T> {
  const { params, data, headers, method, timeout = 5000 } = config;

  // eslint-disable-next-line no-param-reassign
  // 处理这种情况 e.g. v1.0.0/tasks/{taskId}
  if (typeof params !== 'undefined') {
    url = url.replace(/{([\w]+)}/g, (s0, s1) => {
      const res = s1 in params ? params[s1] : s0;
      delete params[s1];
      return res;
    });
  }

  try {
    const res = await instance.request<ICustomResponse<T>>({
      url,
      method,
      headers,
      params,
      data,
      timeout,
    });

    const { code: errorCode, data: result } = res.data;

    /**
     * 前后端约定返回格式，这里约定的是 code 不为 0 的话返回的是错误
     */
    if (errorCode !== 0) {
      throw res.data;
    }

    return result;
  } catch (err) {
    let error: ICustomError;

    if (isAxiosError(err)) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
      }
      error = {
        code: err.response?.status || -1,
        message: err.message,
        isAxiosError: true,
      };
    } else {
      /**
       * 如果不是 axios 自己抛出的异常，那就是系统内部错误，错误返回的还是在数据里
       */
      const { code, message } = err;
      error = { code, message, isAxiosError: false };
    }

    // 登陆信息失效或无效
    if (error.code === 403001 || error.code === 403002) {
      // removeUserCookies();
      process.browser &&
        message.error('Authentication failed, please login again', 1, () => {
          window.location.href = '/login';
        });
    }

    throw error;
  }
}

export function setAuth(userId: number, token: string) {
  instance.defaults.headers.common['userId'] = userId;
  instance.defaults.headers.common['Authorization'] = token;
}

export default {
  get<T = any>(url: string, config: IRequestConfig = {}): Promise<T> {
    return request<T>(url, {
      ...config,
      method: 'get',
    });
  },
  post<T = any>(url: string, config: IRequestConfig = {}): Promise<T> {
    return request<T>(url, {
      ...config,
      method: 'post',
    });
  },
  put<T = any>(url: string, config: IRequestConfig = {}): Promise<T> {
    return request<T>(url, { ...config, method: 'put' });
  },
  patch<T = any>(url: string, config: IRequestConfig = {}): Promise<T> {
    return request<T>(url, { ...config, method: 'patch' });
  },
  delete<T = any>(url: string, config: IRequestConfig = {}): Promise<T> {
    return request<T>(url, { ...config, method: 'delete' });
  },
};
