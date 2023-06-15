import { combineReducers } from 'redux';
import { produce } from 'immer';
import upperFirst from 'lodash.upperfirst';

let savedReducers = null;

class BaseReducer {
  #store = null;
  #cases = new Map();
  #serviceName = null;

  registerAction(serviceKey, store, action) {
    const type = `${this.#serviceName}::${action.key}`;
    if (!this.#cases.get(type)) {
      this.#cases.set(type, (...args) => action.func.apply(this, ...args));
    }
    const instance = Object.getPrototypeOf(this);
    instance[action.key] = (...params) => {
      store.dispatch({
        type,
        params,
      });
    };
  }

  registerActions(serviceKey, store) {
    const instance = Object.getPrototypeOf(this);
    const actionsNames = Object
      .getOwnPropertyNames(instance)
      .filter(name => name.endsWith('Action'))
    ;
    actionsNames.forEach(name => {
      this.registerAction(serviceKey, store, { key: name, func: instance[name] });
    });
  }

  replaceReducer(serviceKey, store, initialReducers) {
    this.#serviceName = upperFirst(serviceKey);
    this.#store = store;
    this.registerActions(serviceKey, store);
    const instance = Object.getPrototypeOf(this);
    const reducer = (...params) => {
      const state = params[0] || instance.getInitialState();
      const action = params[1];
      const { type, params: actionParams } = action;
      const func = this.#cases.get(type);
      return func
        ? produce(state, func.call(this, actionParams))
        : state
      ;
    };

    const allReducers = {
      ...(savedReducers || initialReducers),
      [this.#serviceName]: reducer,
    };
    savedReducers = allReducers;
    store.replaceReducer(combineReducers(allReducers));
  }

  select(state) {
    return state[this.#serviceName];
  }

  getState() {
    if (this.#store) {
      return this.#store.getState();
    } else {
      throw new Error('Store does not apply');
    }
  }

  getStore() {
    return this.#store;
  }
}

export default BaseReducer;
