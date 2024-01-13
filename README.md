# redux-di-container

> Dependency injection container for redux. The library simplifies writing redux code.

[![NPM](https://img.shields.io/npm/v/redux-di-container.svg)](https://www.npmjs.com/package/redux-di-container)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save redux-di-container
```

## Usage

First, you need to create a redux store instance:
```js
// store.js

import { legacy_createStore as createStore, combineReducers } from 'redux';

export const reducers = combineReducers({
  // your other reducers if you have them
});

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
```

Now, you need to create a service:
```js
// features/counter/Counter.service.js

import { BaseReducer } from 'redux-di-container';

export default class CounterService extends BaseReducer {
  // Describe your initial state
  getInitialState() {
    return {
      count: 0,
    };
  }

  // Selector
  count(state) {
    return this.select(state).count;
  }

  increment() {
    this.dispatchAction(state => {
      state.count += 1;
    }, 'increment');
  }

  decrement() {
    this.dispatchAction(state => {
      state.count -= 1;
    }, 'decrement');
  }
}
```
The library uses `immer js` to update state. You can read about immer update patterns
[here](https://immerjs.github.io/immer/update-patterns).

When you have a store and some service, it's time to create a dependency injection (di) container and register your service:

```js
// services.js

import { ReduxDIContainer } from 'redux-di-container';

import store, { reducers } from './store';
import CounterService from './features/counter/Counter.service';

export const di = new ReduxDIContainer();

// Registers new services in container
di.registerServices([
  { key: 'counterService', class: CounterService },
]);

// Injects store into container
di.injectStore(store, reducers, {
  CounterService: {
    count: 100,
  },
});

export const counterService = di.getService('counterService');
```

Let's create some react component that uses the created service:

```js
// features/counter/Counter.js

import React from 'react';
import { connect } from 'react-redux';

import { counterService } from '../../services';

const Counter = (props) => {
  const { count } = props;

  const handleIncrementClick = () => {
    counterService.increment();
  };

  const handleDecrementClick = () => {
    counterService.decrement();
  };

  return (
    <>
      <button onClick={handleIncrementClick}>Increment</button>

      <span>{count}</span>

      <button onClick={handleDecrementClick}>Decrement</button>
    </>
  );

}

const mapStateToProps = state => {
  return {
    count: counterService.count(state),
  };
};

export default connect(
  mapStateToProps
)(Counter);
```

## API

### BaseReducer class:

`dispatchAction(mutatorFn, trace)` - Dispatch action.
* `mutatorFn` - mutator function. See more [here](https://immerjs.github.io/immer/update-patterns).
* `trace` - useful for redux dev tools.

`resetState()` - Reset service state to initial values.

`select(state)` - Return service current state. Uses in selectors.
* `state` - app state.

`createSelector(state)` - Creates [reselect](https://github.com/reduxjs/reselect) selector.
* `state` - app state.

### ReduxDIContainer class:

`registerServices(services)` - registers services into container.
* `services` - array of objects. Each object has shape like `{ key: string, class: ServiceClass }`.

`injectStore(store, reducers, initialState)` - injects store into container.
* `store` - redux store.
* `reducers` - other app reducers if any.
* `initialState` - initial state for services.

`getServices(key)` - gets service from container.
* `key` - service key which uses in `registerService` method.

## Development

You have to link the library to example project. In order to do this, open terminal and run the following commands:

```bash
$ yarn link
$ cd example
$ yarn link "redux-di-container"
```

Now when you make changes in library files, the changes will apply in example project.

To watch library files:

```bash
$ yarn start
```

To watch example project files:

```bash
$ cd example
$ yarn start
```

## License

MIT
