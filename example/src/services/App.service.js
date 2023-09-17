class AppService {
  constructor (opts) {
    this.counterReducer = opts.counterService;
    this.dogsReducer = opts.dogsService;
    this.localStorageService = opts.localStorageService;
  }

  getDogs() {
    this.counterReducer.increment();
    this.dogsReducer.fetchDogs();
    this.localStorageService.setItem('one', 'two');
  }
}

export default AppService;
