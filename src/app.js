const express = require('express');

const routes = require('./interfaces/http/routes');
const notFound = require('./interfaces/http/middlewares/notFound');
const errorHandler = require('./interfaces/http/middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use(routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;