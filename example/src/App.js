import React from 'react'
import { connect } from 'react-redux';

import { appService, dogsReducer, counterReducer } from './services/services';

const App = (props) => {
  const {
    count,
    dogs,
    dogsIsPending,
  } = props;

  const handleIncrementClick = () => {
    counterReducer.increment();
  };

  const handleDecrementClick = () => {
    counterReducer.decrement();
  };

  const handleGetRandomDog = () => {
    appService.getDogs();
  };

  const handleResetCountStateClick = () => {
    counterReducer.resetState();
  };

  const handleResetDogsStateClick = () => {
    dogsReducer.resetState();
  };

  return (
    <div className='container'>
      <div className='example-block'>
        <h2 className='block-title'>Counter example</h2>
        <div>
          <button
            onClick={handleIncrementClick}
          >
            Increment
          </button>
          <span className='counter-label'>
          {count}
        </span>
          <button
            onClick={handleDecrementClick}
          >
            Decrement
          </button>
        </div>
        <div>
          <button
            onClick={handleResetCountStateClick}
          >
            Reset state
          </button>
        </div>
      </div>

      <div className='example-block'>
        <h2 className='block-title'>Get random dog example</h2>
        <button onClick={handleGetRandomDog}>
          Get random dog
        </button>
        <button
          onClick={handleResetDogsStateClick}
        >
          Reset state
        </button>
        <div className='image-wrapper'>
          {dogsIsPending && <span>Loading...</span>}
          {(!dogsIsPending && !!dogs.length) && <img className='image' alt='' src={dogs[0]} />}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    count: counterReducer.$count(state),
    dogs: dogsReducer.$dogs(state),
    dogsIsPending: dogsReducer.$isPending(state),
  };
};

export default connect(
  mapStateToProps
)(App);
