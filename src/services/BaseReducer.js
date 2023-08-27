import { combineReducers } from 'redux';
import { produce } from 'immer';
import upperFirst from 'lodash.upperfirst';
import { createSelector as reselectCreateSelector } from 'reselect';

import WithStore from './WithStore';

let savedReducers = null;
const ACTION_END = 'Action';
const DISPATCH_ACTION_KEY = '#__dispatchAction';
const RESET_STATE_ACTION_KEY = '#__resetAction';
const TRACE_KEY = 'Trace';

class BaseReducer extends WithStore {
  #cases = new Map();
  #serviceName = null;

  __registerAction(action) {
    const type = `${this.#serviceName}::${action.key}`;
    if (!this.#cases.get(type)) {
      this.#cases.set(type, (...args) => action.func.apply(this, ...args));
    }
    const instance = Object.getPrototypeOf(this);
    instance[action.key] = (...params) => {
      this.dispatch({
        type,
        params,
      });
    };
  }

  __registerActions() {
    const instance = Object.getPrototypeOf(this);
    instance[DISPATCH_ACTION_KEY] = newStateFunc => newStateFunc;
    instance[RESET_STATE_ACTION_KEY] = () => () => instance.getInitialState();
    const actionsNames = Object
      .getOwnPropertyNames(instance)
      .filter(name => name.endsWith(ACTION_END))
    ;
    actionsNames.forEach(name => {
      this.__registerAction({ key: name, func: instance[name] });
    });
  }

  replaceReducer(serviceKey, initialReducers) {
    this.#serviceName = upperFirst(serviceKey);
    this.__registerActions();
    const instance = Object.getPrototypeOf(this);
    const reducer = (...params) => {
      const state = params[0] || instance.getInitialState();
      const action = params[1];
      const { type, params: actionParams } = action;
      let func;
      if (type.startsWith(`${this.#serviceName}::${TRACE_KEY}::`)) {
        func = this.#cases.get(`${this.#serviceName}::${DISPATCH_ACTION_KEY}`);
      } else if (type === `${this.#serviceName}::resetState`) {
        func = this.#cases.get(`${this.#serviceName}::${RESET_STATE_ACTION_KEY}`);
      } else {
        func = this.#cases.get(type);
      }
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
    this.getStore().replaceReducer(combineReducers(allReducers));
  }

  select() {
    return this.getState()[this.#serviceName];
  }

  /**
   * Dispatch action.
   *
   * @param {Function} newStateFn Mutate function.
   * @param {string} trace Use in action type for trace in redux devtools.
   */
  dispatchAction(newStateFn, trace = 'dispatchAction') {
    this.dispatch({
      type: `${this.#serviceName}::${TRACE_KEY}::${trace}`,
      params: [newStateFn, trace],
    });
  }

  /**
   * Reset service state.
   */
  resetState() {
    this.dispatch({
      type: `${this.#serviceName}::resetState`,
    });
  }

  createSelector(...args) {
    return reselectCreateSelector(...args)(this.getState());
  }
}

export default BaseReducer;
