import { createContainer, asClass, InjectionMode, Lifetime } from 'awilix';

import BaseReducer from './BaseReducer';
import WithStore from './WithStore';

export default class ReduxDIContainer {
  #services = {};
  #container = createContainer({
    injectionMode: InjectionMode.PROXY,
  });

  registerServices(services) {
    const registrations = services.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.key]: asClass(curr.class, { lifetime: Lifetime.SINGLETON }),
      };
    }, {});
    this.#container.register(registrations);
  }

  applyStore(store, initialReducers) {
    const registrations = this.#container.registrations;
    Object.keys(registrations)
      .forEach(key => {
        const service = this.#container.resolve(key);
        if (service instanceof WithStore) {
          service.setStore(store);
        }
        if (service instanceof BaseReducer) {
          service.replaceReducer(key, store, initialReducers);
        }
        this.#services[key] = service;
      })
    ;
  }

  getService(name) {
    return this.#container.resolve(name);
  }
}
