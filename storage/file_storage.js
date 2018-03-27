var fs = require('fs');

function get(col, name) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./data/${col}${name}.json`, 'utf8', function (err, data) {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(data));
      });
    });  
}
  
function store(col, name, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(`./data/${col}${name}.json`, JSON.stringify(data), function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });  
}

function exists(col, name) {
  return new Promise((resolve, reject) => {
    fs.exists(`./data/${col}${name}.json`, function (exists) {
      resolve(exists);
    });
  });  
}

var interface = (colName) => {
  return {
      get: get.bind(null, colName), 
      store: store.bind(null, colName),
      exists: exists.bind(null, colName)
  }
};

module.exports = {
    battleTemplates: interface("init.battle"),
    battles: interface("battle_"),
    users: interface("user")
};