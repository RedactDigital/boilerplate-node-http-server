const express = require('express');
const app = express();
const jobs = require(`${root}/app/jobs`);
const queues = require(`${root}/app/console`);

try {
  if (!Object.keys(jobs).length) log.error('No jobs created');
  if (!Object.keys(queues).length) log.error('No queues created');
  Object.values(jobs).map(async job => {
    const queue = await queues[job.name];
    if (!queue) return;

    queue.queue.on('process', j => {
      log.info(`PROCESSING: Job ${j.id}`);
    });

    queue.queue.process(job.handle); // Listener event for processing jobs

    queue.queue.on('progress', (j, progress) => {
      log.info(`PROGRESS: Job ${j.id} - ${progress}%`);
    });

    queue.queue.on('completed', j => {
      log.info(`COMPLETED: Job ${j.id} completed`);
    });

    queue.queue.on('stalled', j => {
      log.info(`STALLED: Job ${j.id} stalled`);
    });

    queue.queue.on('failed', (j, err) => {
      log.error(`FAILED: Job ${j.id}`, err);
    });

    queue.queue.on('error', err => {
      log.error(`ERROR: ${err}`);
    });
  });
} catch (err) {
  log.error(err);
}

module.exports = app;
