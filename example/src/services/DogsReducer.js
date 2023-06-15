import { BaseReducer } from 'redux-di-container';

export default class DogsReducer extends BaseReducer {
  getInitialState() {
    return {
      pending: false,
      dogs: [],
      error: null,
    };
  }

  $isPending(state) {
    return this.select(state).pending;
  }

  $dogs(state) {
    return this.select(state).dogs;
  }

  $error(state) {
    return this.select(state).error;
  }

  fetchDogsPendingAction() {
    return state => {
      state.pending = true;
      state.error = null;
    };
  }

  fetchDogsSuccessAction(dogs) {
    return state => {
      state.pending = false;
      state.dogs = dogs;
    };
  }

  fetchDogsErrorAction(error) {
    return state => {
      state.pending = false;
      state.error = error.message;
    };
  }

  fetchDogs() {
    this.fetchDogsPendingAction();
    return window.fetch('https://dog.ceo/api/breeds/image/random')
      .then(response => response.json())
      .then(response => {
        const dogs = [response.message];
        this.fetchDogsSuccessAction(dogs);
        return dogs;
      })
      .catch(error => {
        this.fetchDogsErrorAction(error.message);
        throw error;
      })
    ;
  }
}
