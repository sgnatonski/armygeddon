const assert = require('assert');
const brain = require('brain.js');

const a = character(
    '.#####.' +
    '#.....#' +
    '#.....#' +
    '#######' +
    '#.....#' +
    '#.....#' +
    '#.....#'
);
const b = character(
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.'
);
const c = character(
    '.######' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '.######'
);
const d = character(
    '#####..' +
    '#....#.' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#....#.' +
    '#####..'
);
const e = character(
    '#######' +
    '#......' +
    '#......' +
    '#####..' +
    '#......' +
    '#......' +
    '#######'
);
const f = character(
    '#######' +
    '#......' +
    '#......' +
    '#####..' +
    '#......' +
    '#......' +
    '#......'
);
const g = character(
    '.######' +
    '#......' +
    '#......' +
    '#..####' +
    '#.....#' +
    '#.....#' +
    '.#####.'
);
const h = character(
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#######' +
    '#.....#' +
    '#.....#' +
    '#.....#'
);
const i = character(
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...'
);
const j = character(
    '.....#.' +
    '.....#.' +
    '.....#.' +
    '.....#.' +
    '.....#.' +
    '.#...#.' +
    '..###..'
);
const k = character(
    '#....#.' +
    '#...#..' +
    '#..#...' +
    '####...' +
    '#...#..' +
    '#....#.' +
    '#.....#'
);
const l = character(
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#......' +
    '#######'
);
const m = character(
    '#.....#' +
    '##...##' +
    '#.#.#.#' +
    '#..#..#' +
    '#.....#' +
    '#.....#' +
    '#.....#'
);
const n = character(
    '#.....#' +
    '##....#' +
    '#.#...#' +
    '#..#..#' +
    '#...#.#' +
    '#....##' +
    '#.....#'
);
const o = character(
    '.#####.' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '.#####.'
);
const p = character(
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.' +
    '#......' +
    '#......' +
    '#......'
);
const r = character(
    '######.' +
    '#.....#' +
    '#.....#' +
    '######.' +
    '#...#..' +
    '#....#.' +
    '#.....#'
);
const s = character(
    '.######' +
    '#......' +
    '#......' +
    '.#####.' +
    '......#' +
    '......#' +
    '######.'
);
const t = character(
    '#######' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...'
);
const u = character(
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '.#####.'
);
const w = character(
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#.....#' +
    '#..#..#' +
    '#.#.#.#' +
    '##...##'
);
const x = character(
    '#.....#' +
    '.#...#.' +
    '..#.#..' +
    '...#...' +
    '..#.#..' +
    '.#...#.' +
    '#.....#'
);
const y = character(
    '#.....#' +
    '.#...#.' +
    '..#.#..' +
    '...#...' +
    '...#...' +
    '...#...' +
    '...#...'
);
const z = character(
    '#######' +
    '.....#.' +
    '....#..' +
    '...#...' +
    '..#....' +
    '.#.....' +
    '#######'
);
const _ = character(
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......'
);

const net = new brain.NeuralNetwork({
    //activation: 'sigmoid',
    hiddenLayers: [6, 4]
});

net.train([
    { input: a, output: { a: 1 } },
    { input: b, output: { b: 1 } },
    { input: c, output: { c: 1 } },
    { input: d, output: { d: 1 } },
    { input: e, output: { e: 1 } },
    { input: f, output: { f: 1 } },
    { input: g, output: { g: 1 } },
    { input: h, output: { h: 1 } },
    { input: i, output: { i: 1 } },
    { input: j, output: { j: 1 } },
    { input: k, output: { k: 1 } },
    { input: l, output: { l: 1 } },
    { input: m, output: { m: 1 } },
    { input: n, output: { n: 1 } },
    { input: o, output: { o: 1 } },
    { input: p, output: { p: 1 } },
    { input: r, output: { r: 1 } },
    { input: s, output: { s: 1 } },
    { input: t, output: { t: 1 } },
    { input: u, output: { u: 1 } },
    { input: w, output: { w: 1 } },
    { input: x, output: { x: 1 } },
    { input: y, output: { y: 1 } },
    { input: z, output: { z: 1 } },
    { input: _, output: { _: 1 } }
], {
    iterations: 500000,
    log: detail => console.log(detail)
});
const result = brain.likely(character(
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......' +
    '.......'
), net);

console.log(result);
//console.log(net.toJSON());

/**
 * Turn the # into 1s and . into 0s. for whole string
 * @param string
 * @returns {Array}
 */
function character(string) {
    return string
        .trim()
        .split('')
        .map(c => '#' === c ? 1 : 0);
}