import axiosRetry from 'axios-retry';
import axios from 'axios';
import get from 'lodash/get';

class AxiosBaseService {
  #instance;

  constructor (baseUrl) {
    axios.create({
      baseURL: baseUrl,
    });
  }

  get instance() {
    return this.#instance;
  }
}

export class PublicAxiosService extends AxiosBaseService {
  constructor ({ restApiEndpoint }) {
    super(restApiEndpoint);
  }
}

export class SecureAxiosService extends AxiosBaseService {
  constructor (opts) {
    super(opts.restApiEndpoint);
    this.localStorage = opts.localStorageService;
    this.useAuthorizationInterceptor();
    axiosRetry(this.instance, {
      retries: 1,
      retryCondition: async axiosError => {
        if (axiosError.response.status === 401) {
          try {
            const refreshTokenResponse = await this.refreshToken(axiosError);
            const token = refreshTokenResponse.data;
            axiosError.response.config.headers['Authorization'] = `Bearer ${token.accessToken}`;
            return true;
          } catch (e) {
            return false;
          }
        }
      }
    });
  }

  useAuthorizationInterceptor() {
    this.instance.interceptors.request.use(
      config => {
        const accessToken = get(this.localStorage.getToken(), 'accessToken', null);
        if (!config.headers.Authorization && accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  async refreshToken() {
    const refreshToken = get(this.localStorage.getToken(), 'refreshToken', null);
    if (!refreshToken) {
      this.localStorage.removeToken();
      throw new Error();
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API}/auth/refreshToken`, { refreshToken });
      const token = response.data;
      this.localStorage.setToken(token);
      return response;
    } catch (e) {
      return false;
    }
  };
}

export default class RestApiService {
  #publicInstance;
  #secureInstance;

  constructor (opts) {
    this.#publicInstance = opts.publicAxiosService;
    this.#secureInstance = opts.secureAxiosService;
  }

  get publicInstance() {
    return this.#publicInstance;
  }

  get secureInstance() {
    return this.#secureInstance;
  }
}
