var fs = require('fs');

var openBattles = new Set();

function syncBattleState(filename){
    fs.readFile(`./data/${filename}`, function (err, file) {
        var data = JSON.parse(file);
        if (!data.winningArmy){
            openBattles.add(data.id);
        }
        else{
            openBattles.delete(data.id);
        }
    });
}

fs.readdir('./data', (err, files) => {
    files.forEach(filename => {
        if (filename.startsWith('battle')){
            syncBattleState(filename);
        }
    });
});

fs.watch('./data', function (event, filename) {
    if (event == 'change' && filename.startsWith('battle')) {
        syncBattleState(filename);
    }
});

module.exports = {
    getOpen: () =>{
        return Array.from(openBattles);
    }
};