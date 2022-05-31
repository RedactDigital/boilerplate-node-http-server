const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const client = require(`${root}/app/http/middleware/redis`);

module.exports = rateLimit({
  store:
    process.env.NODE_ENV !== 'test'
      ? new RedisStore({
          sendCommand: (...args) => client.sendCommand(args),
        })
      : null,
  max: process.env.REQUEST_LIMIT,
  windowMs: process.env.REQUEST_PERIOD * 60 * 1000, // converts minutes to milliseconds
  message: { success: false, msg: 'Too many requests' },
});
