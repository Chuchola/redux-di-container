import {
  ReduxDIContainer,
  LocalStorageService,
} from 'redux-di-container';

import store, { reducers } from '../store';
import CounterReducer from './CounterReducer';
import DogsReducer from './DogsReducer';
import AppService from './App.service';

export const di = new ReduxDIContainer();
di.registerServices([
  { key: 'storageVersion', value: 'v1' },
  { key: 'restApiEndpoint', value: 'https://hello.com/api/v1' },
  { key: 'counterService', class: CounterReducer },
  { key: 'dogsService', class: DogsReducer },
  { key: 'appService', class: AppService },
  { key: 'localStorageService', class: LocalStorageService },
]);
di.injectStore(store, reducers);

export const counterReducer = di.getService('counterService');
export const dogsReducer = di.getService('dogsService');
export const appService = di.getService('appService');
