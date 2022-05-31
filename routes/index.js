const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const arr = [];

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const filePath = require(path.join(__dirname, file));
    arr.push(filePath);
  });

// Must be last to to catch any routes that don't match
arr.push((req, res) => {
  res.status(404).json({ success: false, msg: '404 Not found' });
});

module.exports = arr;
