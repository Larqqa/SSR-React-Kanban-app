import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Server imports
import htmlFile from '../public/index.html';
import getR from './controllers/get';

// React Imports
import App from '../app/App';
import getRed from '../app/reducers/get';

// Create app and set serve folder
const app = express();
app.use(cors());
app.use(express.static('build'));

app.use(bodyParser.json());
app.use('/api/get', getR);

app.get('*', (req, res) => {

  const store = createStore(getRed);

  // Create the app with routes
  const app = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App/>
      </StaticRouter>
    </Provider>
  );

  // Set app and script to index.html 
  let html = htmlFile
    .replace('<!-- root -->', app)
    .replace('<!-- script -->', '/bundle.js')
    .replace(
      '<!-- preload -->',
      `<script id="init">window.__PRELOAD__ = ${JSON.stringify(store.getState()).replace(/</g,'\\u003c')}</script>`);

  // Send HTML response
  return res.send(html).end();
});

// Run server
const port = 3000;
app.listen(port, err => {
  if (err) return console.error(err);
  console.log(`Server listening to: ${port} 😎`);
});