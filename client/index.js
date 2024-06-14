import React from 'react';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './Redux/store.js';
import { createRoot } from 'react-dom/client';
import '../public/style.css';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
