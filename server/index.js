// const express = require('express');
import express from 'express';

import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import next from 'next';

import compression from 'compression';
import morgan from 'morgan';

import connectMongo from 'connect-mongo';
import session from 'express-session';

import api from './routes';

const server = express();

const dev = process.env.NODE_ENV === 'development';
const app = next({ dev });
const defaultRequestHandler = app.getRequestHandler();

const LOCAL_DB = 'theseed';
const SESSION_KEY = 'connect.sid';
const SESSION_SECRET = 'jfoiesofj@#JIFSIOfsjieo@320923';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/${LOCAL_DB}`;
const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  // Parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }));
  // Parse application/json
  server.use(bodyParser.json());

  // Theseed Custom
  server.use(compression());
  server.use(morgan('dev'));

  // MongoDB
  // mongoose.set('debug', true);
  mongoose.Promise = global.Promise;
  mongoose.connect(
    MONGODB_URI,
    { useMongoClient: true },
  );
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  // Session
  const MongoStore = connectMongo(session);
  server.use(
    session({
      key: SESSION_KEY,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        maxAge: 365 * (24 * 60 * 60 * 1000),
        domain: dev ? undefined : undefined,
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 365 * (24 * 60 * 60 * 1000),
      }),
    }),
  );

  // API routes
  server.use('/api', api);

  // Next.js request handling
  const customRequestHandler = (page, req, res) => {
    // Both query and params will be available in getInitialProps({query})
    const mergedQuery = Object.assign({}, req.query, req.params);
    app.render(req, res, page, mergedQuery);
  };

  // Routes
  // server.get('/', customRequestHandler.bind(undefined, '/'));
  server.get('/about/:id', customRequestHandler.bind(undefined, '/about'));
  server.get('*', defaultRequestHandler);

  server.listen(PORT, () => {
    console.log(
      `App running on http://localhost:${PORT}/\nAPI running on http://localhost:${PORT}/api/`,
    );
  });
});
