import axiosRetry from 'axios-retry';
import axios from 'axios';

class AxiosBaseService {
  #instance;

  constructor (baseUrl) {
    this.#instance = axios.create({
      baseURL: baseUrl,
    });
  }

  get instance() {
    return this.#instance;
  }
}

export class PublicAxiosService extends AxiosBaseService {
}

export class SecureAxiosService extends AxiosBaseService {
  constructor (serviceConfig) {
    super(serviceConfig.baseUrl);
    this.serviceConfig = serviceConfig;
    this.useAuthorizationInterceptor();
    if (serviceConfig.refreshToken) {
      axiosRetry(this.instance, {
        retries: 1,
        retryCondition: async axiosError => {
          if (axiosError.response.status === 401) {
            try {
              await serviceConfig.refreshToken();
              axiosError.response.config.headers.Authorization = serviceConfig.getAuthorizationHeaderValue();
              return true;
            } catch (e) {
              return false;
            }
          }
        },
      });
    }
  }

  useAuthorizationInterceptor() {
    this.instance.interceptors.request.use(
      config => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = this.serviceConfig.getAuthorizationHeaderValue();
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
}

export default class RestApiService {
  #publicInstance;
  #secureInstance;

  constructor (config) {
    this.#publicInstance = new PublicAxiosService(config.baseUrl);
    if (config.getAuthorizationHeaderValue) {
      this.#secureInstance = new SecureAxiosService(config);
    }
  }

  get publicAxios() {
    return this.#publicInstance.instance;
  }

  get secureAxios() {
    return this.#secureInstance.instance;
  }
}
