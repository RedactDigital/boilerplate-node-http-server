const { createClient } = require('redis');

const redis = {
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || 'password',
  user: process.env.REDIS_USER || 'default',
};

const url = `redis://${redis.user}:${redis.password}@${redis.host}:${redis.port}`;

const client = createClient({
  url,
});

client.on('error', err => {
  log.critical('Redis error: ', err);
});

if (process.env.NODE_ENV !== 'test') client.connect();

client.on('connect', () => {
  log.info('Redis connected...');
});

module.exports = client;
