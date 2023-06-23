import { WithStore } from 'redux-di-container';

class AppService extends WithStore {
  constructor (opts) {
    super();
    this.counterReducer = opts.counterService;
    this.dogsReducer = opts.dogsService;
  }

  getDogs() {
    this.counterReducer.increment();
    this.dogsReducer.fetchDogs();
  }
}

export default AppService;
