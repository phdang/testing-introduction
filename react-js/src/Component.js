import React, { useState } from 'react';

function Component() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button className='btn' onClick={handleClick}>Increment</button>
    </div>
  );
}

export default Component;