var defaultHeaders = { 'Content-Type': 'application/json' };
var fetchOpts = {
    get: {
        method: 'GET',
        credentials: 'include',
        defaultHeaders
    },
    post: {
        method: 'POST',
        credentials: 'include',
        defaultHeaders
    }
}

var Game = Game || {};

Game.fetch = function () {
    return { 
        get: url => fetch(url, fetchOpts.get)
            .then(response => response.text())
            .then(json => JSON.parse(json)),
        post: (url, body) => {
            var opts = body 
            ? Object.assign({}, fetchOpts.post, { 
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            : fetchOpts.post;
            
            return fetch(url, opts)
                .then(response => response.text())
                .then(json => JSON.parse(json));
        }
            
    };	
};