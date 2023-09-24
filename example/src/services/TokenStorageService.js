export default class TokenStorageService {
  static KEY = 'token';

  setToken(value) {
    window.localStorage.setItem(TokenStorageService.KEY, value);
  }

  getToken() {
    return window.localStorage.getItem(TokenStorageService.KEY);
  }
}
