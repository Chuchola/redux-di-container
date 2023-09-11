// import { createSelector } from 'reselect';

class AppService {
  constructor (opts) {
    this.counterReducer = opts.counterService;
    this.dogsReducer = opts.dogsService;
  }

  // $countObj = createSelector(
  //   [
  //     state => this.counterReducer.$count(state),
  //   ],
  //   count => {
  //     console.log('\x1b[31m@@@@@@@@@@@@@@@\x1b[0m', {
  //       count,
  //     });
  //     return {
  //       count,
  //     };
  //   }
  // );

  getDogs() {
    this.counterReducer.increment();
    this.dogsReducer.fetchDogs();
  }
}

export default AppService;
