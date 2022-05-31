const CreateQueue = require('bull');

const redis = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
};

module.exports = (name, data, opt) => {
  if (process.env.NODE_ENV === 'test') return;
  const queue = new CreateQueue(name, {
    redis,
    settings: {
      maxStalledCount: 3, // Max number of times a job can be restarted before being killed
    },
  });
  opt.attempts = 3;
  opt.timeout = 60000;
  return queue.add(data, opt);
};
