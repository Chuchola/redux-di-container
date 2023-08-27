class AppService {
  constructor (opts) {
    this.counterReducer = opts.counterService;
    this.dogsReducer = opts.dogsService;
  }

  getDogs() {
    this.counterReducer.increment();
    this.dogsReducer.fetchDogs();
  }
}

export default AppService;
