function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function assignRandomFields(terrain, army, righSide){
    function comp(a, b){
        var mod = righSide ? 1 : -1;
        if(a.x < b.x){
            return 1 * mod;
        }
        if(a.x > b.x){
            return -1 * mod;
        }
        return 0;
    }
    
    const grouped = Array.from(groupBy(terrain, t => t.y));
    var ls = grouped.map(function(key) {
        var value = key[1];
        value.sort(comp);
        var half_length = Math.ceil(value.length / 4);
        var side = value.splice(0, half_length);
        return side;
    })
    .reduce((a, b) => a.concat(b));

    shuffleArray(ls);

    return army.units.map((u, i) => Object.assign({
        pos: { x: ls[i].x, y: ls[i].y },
        directions: righSide ? [4] : [1] 
    }, u)).reduce(function(acc, cur) {
        acc[cur.id] = cur;
        return acc;
    }, {});
}

module.exports = assignRandomFields;