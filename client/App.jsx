import React from 'react';
import Slider from './components/Slider';
import Visual from './components/Visual';
import Sidebar from './components/Sidebar';
import RedisForm from './components/CustForm';

function App() {
  return (
    <div>
      <Sidebar />
      <div className="main-container">
        <h1 className="title">radish is running</h1>
        <Slider />
        <Visual />
      </div>
      <div className='form-container'>
        <RedisForm />
      </div>
    </div>
  );
}

export default App;
