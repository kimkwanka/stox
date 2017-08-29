import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import initReactRoutes from './reactRoutes';
import api from './api';

const app = express();

// Enable body-paser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static assets
app.use(express.static(path.join(__dirname, '../../dist/public')));

// Server side rendering of React pages
app.use('*', (req, res, next) => {
  initReactRoutes
    .then((handleReactRoutes) => {
      handleReactRoutes(req, res, next);
    })
    .catch((error) => {
      throw error;
    });
});

// Api route
api(app);

// 404
app.get('*', (req, res) => {
  res.status(404).end();
});

export default app;
