import React from 'react'
import { connect } from 'react-redux';

import { appService, dogsReducer, counterReducer } from './services/services';

const App = (props) => {
  const {
    count,
    dogsObj,
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
          {dogsObj.isPending && <span>Loading...</span>}
          {(!dogsObj.isPending && !!dogsObj.dogs.length) && <img className='image' alt='' src={dogsObj.dogs[0]} />}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = () => {
  return {
    count: counterReducer.$count(),
    dogsObj: dogsReducer.$dogsObj(),
  };
};

export default connect(
  mapStateToProps
)(App);
