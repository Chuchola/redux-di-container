import { BaseReducer } from 'redux-di-container';

export default class DogsReducer extends BaseReducer {
  constructor (opts) {
    super();
    this.dogsRestApiService = opts.dogsRestApiService;
  }

  getInitialState() {
    return {
      pending: false,
      dogs: [],
      error: null,
    };
  }

  isPendingSelect(state) {
    return this.select(state).pending;
  }

  dogsSelect(state) {
    return this.select(state).dogs;
  }

  errorSelect(state) {
    return this.select(state).error;
  }

  dogsObjSelector = this.createSelector(
    state => this.isPendingSelect(state),
    state => this.dogsSelect(state),
    state => this.errorSelect(state),
    (isPending, dogs, error) => {
      return {
        isPending,
        dogs,
        error,
      };
    }
  );

  fetchDogs() {
    this.dispatchAction(state => {
      state.pending = true;
      state.error = null;
    }, 'fetchDogsPending');
    return this.dogsRestApiService.publicAxios.get('/breeds/image/random')
      .then(response => {
        const dogs = [response.data.message];
        this.dispatchAction(state => {
          state.pending = false;
          state.dogs = dogs;
        }, 'fetchDogsSuccess');
        return dogs;
      })
      .catch(error => {
        this.dispatchAction(state => {
          state.pending = false;
          state.error = error.message;
        }, 'fetchDogsError');
        throw error;
      })
    ;
  }
}
