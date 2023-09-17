import {
  createContainer,
  asClass,
  asValue,
  InjectionMode,
  Lifetime,
} from 'awilix';

import BaseReducer from './BaseReducer';
import WithStore from './WithStore';

export default class ReduxDIContainer {
  #services = {};
  #container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  registerServices(services) {
    const registrations = services.reduce((acc, curr) => {
      let added;
      if (curr.class) {
        added = asClass(curr.class, { lifetime: Lifetime.SINGLETON });
      } else if (curr.value) {
        added = asValue(curr.value);
      }
      return {
        ...acc,
        [curr.key]: added,
      };
    }, {});
    this.#container.register(registrations);
  }

  injectStore(store, initialReducers) {
    const registrations = this.#container.registrations;
    Object.keys(registrations)
      .forEach(key => {
        const service = this.#container.resolve(key);
        if (service instanceof WithStore) {
          service.setStore(store);
        }
        if (service instanceof BaseReducer) {
          service.replaceReducer(key, initialReducers);
        }
        this.#services[key] = service;
      })
    ;
  }

  getService(name) {
    return this.#container.resolve(name);
  }
}
