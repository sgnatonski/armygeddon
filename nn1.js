const assert = require('assert');
const brain = require('brain.js');

/**
 * #### marks describe distance between characteristic of player and population
 */

const cav_heavy = character(
    '.....####' + // forest vs plain
    '...######' + // round vs ellipsis
    '...######' + // defending vs attacking
    '.....####' + // hierarchy vs equality
    '.....####' + // mobility preference
    '.....####' + // defence preference
    '###......'   // range preference    
);
const cav_light = character(
    '.....####' + // forest vs plain
    '....#####' + // round vs ellipsis
    '....#####' + // defending vs attacking
    '....#####' + // hierarchy vs equality
    '......###' + // mobility preference
    '....#####' + // defence preference
    '...####..'   // range preference    
);
const cav_range = character(
    '.......##' + // forest vs plain
    '...######' + // round vs ellipsis
    '.....####' + // defending vs attacking
    '..#######' + // hierarchy vs equality
    '......###' + // mobility preference
    '###......' + // defence preference
    '......###'   // range preference    
);
const inf_heavy = character(
    '....#####' + // forest vs plain
    '#####....' + // round vs ellipsis
    '####.....' + // defending vs attacking
    '....#####' + // hierarchy vs equality
    '###......' + // mobility preference
    '....#####' + // defence preference
    '###......'   // range preference    
);
const inf_light = character(
    '.#######.' + // forest vs plain
    '..#####..' + // round vs ellipsis
    '..#####..' + // defending vs attacking
    '..#####..' + // hierarchy vs equality
    '..#####..' + // mobility preference
    '..#####..' + // defence preference
    '####.....'   // range preference    
);
const arch_heavy = character(
    '.....####' + // forest vs plain
    '..#####..' + // round vs ellipsis
    '#####....' + // defending vs attacking
    '.....####' + // hierarchy vs equality
    '....#####' + // mobility preference
    '####.....' + // defence preference
    '.....####'   // range preference    
);
const arch_light = character(
    '######...' + // forest vs plain
    '.#######.' + // round vs ellipsis
    '....#####' + // defending vs attacking
    '#####....' + // hierarchy vs equality
    '....#####' + // mobility preference
    '#####....' + // defence preference
    '....#####'   // range preference    
);

const net = new brain.NeuralNetwork({
    //activation: 'sigmoid',
});

net.train([
    { input: cav_heavy, output: { cav_heavy: 1 } },
    { input: cav_light, output: { cav_light: 1 } },
    { input: cav_range, output: { cav_range: 1 } },
    { input: inf_heavy, output: { inf_heavy: 1 } },
    { input: inf_light, output: { inf_light: 1 } },
    { input: arch_heavy, output: { arch_heavy: 1 } },
    { input: arch_light, output: { arch_light: 1 } },
], {
    errorThresh: 0.005,
    log: detail => console.log(detail)
});

const prob = sortObject(net.run(character(
    '...######' + // forest vs plain
    '......###' + // round vs ellipsis
    '####.....' + // defending vs attacking
    '###......' + // hierarchy vs equality
    '...###...' + // mobility preference
    '...###...' + // defence preference
    '..####...'   // range preference     
)));
console.log(prob);

function character(string) {
    return string
        .trim()
        .split('')
        .map(c => '#' === c ? 1 : 0);
}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'prob': obj[prop],
                'cost': Math.ceil(100 - Math.min(obj[prop] * 500, 90)) / 100
            });
        }
    }
    arr.sort((a, b) => b.prob - a.prob);
    return arr;
}