import React, { useContext } from 'react';
import { AppContext } from './state';

function App() {
  const { state } = useContext(AppContext);

  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Loading status: {state.isLoading ? 'Loading...' : 'Not loading'}</p>
    </div>
  );
}

export default App;
