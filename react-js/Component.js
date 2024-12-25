import React from 'react';

export default class Component extends React.Component {
  render() {
    return (
      <button onClick={() => console.log('Clicked!')} className='btn'>
        Click Me
      </button>
    );
  }
}
