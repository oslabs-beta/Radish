
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './Redux/store.ts';
import { createRoot } from 'react-dom/client';
import '../public/style.css';
import React from 'react';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
