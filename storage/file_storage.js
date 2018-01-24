var fs = require('fs');

function get(name) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./data/${name}.json`, 'utf8', function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });  
}
  
function store(name, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`./data/${name}.json`, JSON.stringify(data), function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });  
}

function exists(name) {
  return new Promise((resolve, reject) => {
    fs.exists(`./data/${name}.json`, function (exists) {
      resolve(exists);
    });
  });  
  
}

module.exports = {
    get, 
    store,
    exists
};