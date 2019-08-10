// Server imports
import config from './utils/config';
import middleware from './utils/middleware';
import logger from './utils/logger';
import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './controllers/users';
import loginRouter from './controllers/login';
import projectsRouter from './controllers/projects';

// Client imports
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import storeInit from '../app/store';
import App from '../app/App';
import indexHTML from '../public/index.html';


mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    logger.info('Connected to MongoDB 🐈');
  })
  .catch((error) => {
    logger.error('Connecting to MongoDB failed:', error.message);
  });

app.use(cors());
app.use(express.static(
  process.env.NODE_ENV === 'development' ?
    'devBuild'
    :
    'build'
));
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use(middleware.getBearerToken);

// Routers
app.use('/api/user', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/projects', projectsRouter);

// Handle serving
app.get('*', (req, res) => {

  // Create the app with routes
  const appRoot = renderToString(
    <Provider store={ storeInit() }>
      <StaticRouter location={req.url}>
        <App/>
      </StaticRouter>
    </Provider>
  );

  // Set app and script to index.html 
  let html = indexHTML
    .replace('<!-- root -->', appRoot)
    .replace('<!-- script -->', '/bundle.js');

  // Send HTML response
  return res.send(html).end();
});

app.use(middleware.errorHandler);

// Run server on port 3000
const port = 3000;
app.listen( port, () => console.log(`Server is listening to port ${port} 😎`))
  .on('error', err => { console.log(err); });