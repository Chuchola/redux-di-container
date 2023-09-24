// import axios from 'axios';
// import get from 'lodash/get';
import { RestApiService } from 'redux-di-container';

export default class DogsRestApiService extends RestApiService {
  // static TOKEN_KEY = 'token';

  constructor () {
    super({
      baseUrl: 'https://dog.ceo/api',
      // getAuthorizationHeaderValue() {
      //   const accessToken = get(window.localStorage.getItem(DogsRestApiService.TOKEN_KEY), 'accessToken', null);
      //   if (accessToken) {
      //     return `Bearer ${accessToken}`;
      //   }
      //   throw new Error('Access token does not specified.');
      // },
      // async refreshToken() {
      //   const refreshToken = get(window.localStorage.getItem(DogsRestApiService.TOKEN_KEY), 'refreshToken', null);
      //   if (!refreshToken) {
      //     window.localStorage.removeItem(DogsRestApiService.TOKEN_KEY);
      //     throw new Error();
      //   }
      //   const response = await axios.post(`${this.baseUrl}/auth/refreshToken`, { refreshToken });
      //   const token = response.data;
      //   window.localStorage.setItem(DogsRestApiService.TOKEN_KEY, token);
      // },
    });
  }
}
