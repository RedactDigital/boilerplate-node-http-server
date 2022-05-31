const fs = require('fs');
const path = require('path');
const basename = 'index.js';
const obj = {};

module.exports = directory => {
  fs.readdirSync(directory)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && !file.includes('spec'))
    .forEach(file => {
      const filePath = require(path.join(directory, file));
      const key = file.split('.')[0];
      obj[key] = filePath;
    });
  return obj;
};
