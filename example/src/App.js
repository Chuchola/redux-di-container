import React from 'react'
import { connect } from 'react-redux';

import { dogsReducer, counterReducer } from './services/services';

const App = (props) => {
  const {
    count,
  } = props;

  const handleIncrementClick = () => {
    counterReducer.incrementAction();
  };

  const handleDecrementClick = () => {
    counterReducer.decrementAction();
  };

  return (
    <div className='container'>
      <div className='counter-block'>
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
    </div>
  );
}

const mapStateToProps = state => {
  return {
    count: counterReducer.$count(state),
  };
};

export default connect(
  mapStateToProps
)(App);
