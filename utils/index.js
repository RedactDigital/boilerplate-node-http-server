const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const obj = {};

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const filePath = require(path.join(__dirname, file));
    const key = file.split('.')[0];
    obj[key] = filePath;
  });

module.exports = obj;
