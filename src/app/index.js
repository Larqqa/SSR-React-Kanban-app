import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import storeInit from './store';
import App from './App';
import 'normalize.css';

const store = storeInit();
hydrate (
  <Provider store={ store }>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);