const { Router } = require('express');
const serverAdapter = require(`${root}/app/http/controller/development/bull`);

const development = new Router();

module.exports = development.use(
  '/dev/bull',
  (req, res, next) =>
    process.env.NODE_ENV === 'production' ? res.status(404).json({ success: false, msg: '404 Not found' }) : next(),
  serverAdapter.getRouter()
);
