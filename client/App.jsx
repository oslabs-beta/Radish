import React from 'react';
import Slider from './components/Slider';
import Visual from './components/Visual';
import Sidebar from './components/Sidebar';
import RedisForm from './components/CustForm';

function App() {
  return (
    <div>
      <Sidebar />
      <h1>radish is running</h1>
      <Slider />
      <Visual />
      <RedisForm />
    </div>
  );
}

export default App;
