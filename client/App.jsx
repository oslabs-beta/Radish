import React from 'react';
import { useState, useEffect } from 'react';
import Slider from './components/Slider';
import '../public/style.css';
import ClusterVisualization from './components/ClusterVisualization';

function App() {
  return (
    <div>
      <h1>react is running</h1>
      <Slider />
      <ClusterVisualization/>
    </div>
  );
}

export default App;
