const Queue = require('bull');
const { ExpressAdapter } = require('@bull-board/express');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { createBullBoard } = require('@bull-board/api');
const jobs = require(`${root}/app/jobs`);
const queues = require(`${root}/app/console`);

const serverAdapter = new ExpressAdapter();
const adapters = [];

try {
  if (!Object.keys(jobs).length) log.error('No jobs created');
  if (!Object.keys(queues).length) log.error('No queues created');

  Object.values(jobs).forEach(async job => {
    if (process.env.NODE_ENV === 'test') return;

    const queue = new Queue(job.name, {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    });
    if (job.name) adapters.push(new BullAdapter(queue));
  });

  createBullBoard({
    queues: adapters,
    serverAdapter,
  });

  module.exports = serverAdapter.setBasePath('/dev/bull');
} catch (err) {
  log.error('Bull Board Error:', err);
}
