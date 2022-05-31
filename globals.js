require('dotenv').config();
const path = require('path');
const dayjs = require('dayjs');

root = path.resolve(__dirname);

const logger = require(`${root}/utils/log`);

day = dayjs;
log = logger;

module.exports = {
  global,
};
