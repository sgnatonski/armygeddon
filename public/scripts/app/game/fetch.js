var fetchOpts = {
    get: {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
      },
      post: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
    }
}

var Game = Game || {};

Game.fetch = function () {
    return { 
        get: url => fetch(url, fetchOpts.get)
            .then(response => response.text())
            .then(json => JSON.parse(json)),
        post: url => fetch(url, fetchOpts.post)
            .then(response => response.text())
            .then(json => JSON.parse(json))
    };	
};