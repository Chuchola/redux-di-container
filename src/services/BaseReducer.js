import { combineReducers } from 'redux';
import { produce } from 'immer';
import upperFirst from 'lodash.upperfirst';

let savedReducers = null;
const ACTION_END = 'Action';
const DISPATCH_ACTION_KEY = '#__dispatchAction';
const TRACE_KEY = 'Trace';

class BaseReducer {
  #store = null;
  #cases = new Map();
  #serviceName = null;

  __registerAction(serviceKey, store, action) {
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

  __registerActions(serviceKey, store) {
    const instance = Object.getPrototypeOf(this);
    instance[DISPATCH_ACTION_KEY] = newStateFunc => newStateFunc;
    const actionsNames = Object
      .getOwnPropertyNames(instance)
      .filter(name => name.endsWith(ACTION_END))
    ;
    actionsNames.forEach(name => {
      this.__registerAction(serviceKey, store, { key: name, func: instance[name] });
    });
  }

  replaceReducer(serviceKey, store, initialReducers) {
    this.#serviceName = upperFirst(serviceKey);
    this.#store = store;
    this.__registerActions(serviceKey, store);
    const instance = Object.getPrototypeOf(this);
    const reducer = (...params) => {
      const state = params[0] || instance.getInitialState();
      const action = params[1];
      const { type, params: actionParams } = action;
      const func = type.startsWith(`${this.#serviceName}::${TRACE_KEY}::`)
        ? this.#cases.get(`${this.#serviceName}::${DISPATCH_ACTION_KEY}`)
        : this.#cases.get(type)
      ;
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

  /**
   * Dispatch action.
   *
   * @param {Function} newStateFn Mutate function.
   * @param {string} trace Use in action type for trace in redux devtools.
   */
  dispatchAction(newStateFn, trace = 'dispatchAction') {
    this.#store.dispatch({
      type: `${this.#serviceName}::${TRACE_KEY}::${trace}`,
      params: [newStateFn, trace],
    });
  }
}

export default BaseReducer;
