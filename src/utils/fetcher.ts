import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getItem } from "./local-storage";

const BASE_URL = "https://mataair-api.orbitallabs.net";

export interface Response<T = any> {
  data?: T;
  errors?: string[];
  message: string;
  status: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export const instance = axios.create({
  baseURL: BASE_URL
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export async function fetcher<TResponse = any, TError = any, TData = any>(
  requestConfig: AxiosRequestConfig<TData>
) {
  try {
    instance.interceptors.request.use(
      async function (config) {
        const token = await getItem("token");
        if (token && config.headers)
          config.headers.Authorization = `Bearer ${token}`;

        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
    const { data } = await instance.request<Response<TResponse>>(requestConfig);
    return data;
  } catch (error) {
    throw (error as AxiosError<TResponse, TData>).response?.data as TError;
  }
}

// infinity fetcher to match react-query and api response
export async function infinityFetcher<
  TResponse = any,
  TError = any,
  TData = any
>(requestConfig: AxiosRequestConfig<TData>) {
  const { page } = requestConfig.params ?? { page: 1 };
  const { data, meta } = await fetcher<TResponse, TError, TData>(requestConfig);

  const { total, limit } = meta ?? { total: 0, limit: 10 };

  return {
    data: page === null ? [] : data,
    nextPage: page + 1,
    totalPages: Math.ceil(total / limit)
  };
}
export default fetcher;
