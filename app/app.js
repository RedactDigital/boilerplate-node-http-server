const express = require('express');
const app = express();
const toobusy = require('toobusy-js');
const helmet = require('helmet');
const cors = require('cors');
const { requestLimiter } = require(`${root}/app/http/middleware`);
const routes = require(`${root}/routes`);

module.exports = () => {
  app
    // If the request is taking too long, send a 503 response
    .use((_, res, next) => {
      if (toobusy()) res.status(503).json({ success: false, msg: 'Server too busy' });
      next();
    })
    .set('trust proxy', 1) // trust first proxy

    // Middleware before every route
    .use(
      helmet({ contentSecurityPolicy: process.env.ENV === 'production' ? undefined : false }), // Helmet helps you secure your Express apps by setting various HTTP headers
      cors(), // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options
      express.json(), // Express json middleware parses the JSON object in the request body and makes it available on req.body
      requestLimiter, // Limit the number of requests per second
      routes
    );

  return app;
};
