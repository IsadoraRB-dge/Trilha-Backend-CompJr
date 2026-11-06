const express = require('express');
const helmet = require('helmet');

const routes = require('./interfaces/http/routes');
const notFound = require('./interfaces/http/middlewares/notFound');
const errorHandler = require('./interfaces/http/middlewares/errorHandler');

const app = express();

app.use(helmet());

app.use(express.json({ limit: '100kb' }));

app.use(routes)
app.use(notFound);
app.use(errorHandler);

module.exports = app;