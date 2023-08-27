export default class WithStore {
  #store = null;

  setStore(store) {
    this.#store = store;
  }

  getStore() {
    return this.#store;
  }

  getState() {
    if (this.#store) {
      return this.#store.getState();
    } else {
      throw new Error('Store did not inject.');
    }
  }

  dispatch(action) {
    if (this.#store) {
      return this.#store.dispatch(action);
    } else {
      throw new Error('Store did not inject.');
    }
  }
}
