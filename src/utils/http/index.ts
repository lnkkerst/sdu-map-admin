import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import axios from 'axios';
import { Snackbar } from '@varlet/ui';

export function createAxios(options: AxiosRequestConfig = {}): AxiosInstance {
  const defaultOptions: AxiosRequestConfig = {
    timeout: 10000
  };
  return axios.create({ ...defaultOptions, ...options });
}

function errorHandler(error: any) {
  const t = (msg: string) => msg;
  if (error.code === 401) {
    Snackbar.error({
      content: t('api.token_invalid'),
      position: 'bottom'
    });
  }
  if (error.code === 403) {
    Snackbar.error({
      content: t('api.token_forbidden'),
      position: 'bottom'
    });
  }
  if (error.code === 404) {
    Snackbar.error({
      content: t('api.not_found')
    });
  }
  return Promise.reject(error);
}

const http = createAxios({
  baseURL: import.meta.env.VITE_SERVER_URL
});

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (useUserStore().token && config.headers) {
      config.headers.token = useUserStore().token;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error(error.message);
    return Promise.reject(error);
  }
);

http.interceptors.response.use((res: AxiosResponse) => {
  return res;
}, errorHandler);

export default http;
