import { BaseReducer } from 'redux-di-container';

export default class DogsReducer extends BaseReducer {
  getInitialState() {
    return {
      pending: false,
      dogs: [],
      error: null,
    };
  }

  $isPending() {
    return this.select().pending;
  }

  $dogs() {
    return this.select().dogs;
  }

  $error() {
    return this.select().error;
  }

  $dogsObj() {
    return this.createSelector(
      () => this.$isPending(),
      () => this.$dogs(),
      () => this.$error(),
      (isPending, dogs, error) => {
        return {
          isPending,
          dogs,
          error,
        };
      }
    );
  }

  fetchDogs() {
    this.dispatchAction(state => {
      state.pending = true;
      state.error = null;
    }, 'fetchDogsPending');
    return window.fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(response => {
        const dogs = [response.message];
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
