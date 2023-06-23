import { BaseReducer } from 'redux-di-container';

export default class CounterReducer extends BaseReducer {
  getInitialState() {
    return {
      count: 0,
    };
  }

  $count(state) {
    return this.select(state).count;
  }

  incrementAction() {
    return state => {
      state.count += 1;
    };
  }

  decrementAction() {
    return state => {
      state.count -= 1;
    };
  }

  increment() {
    this.dispatchAction(state => {
      state.count += 1;
    }, 'increment');
  }
}
