export default class LocalStorageService {
  #version = '';

  constructor (opts) {
    try {
      this.#version = opts.storageVersion;
    } catch (e) {
    }
  }

  _getKey(key) {
    return `${this.#version}${this.#version ? '::' : ''}${key}`;
  }

  setItem(key, value) {
    window.localStorage.setItem(this._getKey(key), JSON.stringify(value));
  }

  getItem(key, defaultValue = null) {
    const value = window.localStorage.getItem(this._getKey(key));
    return value ? JSON.parse(value) : defaultValue;
  }

  removeItem(key) {
    window.localStorage.removeItem(this._getKey(key));
  }
}
