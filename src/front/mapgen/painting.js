/*
 * From https://www.redblobgames.com/maps/mapgen4/
 * Copyright 2018 Red Blob Games <redblobgames@gmail.com>
 * License: Apache v2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *
 * This module allows the user to paint constraints for the map generator
 */
'use strict';

/* global Draggable */

/*
 * The painting interface uses a square array of elevations. As you
 * drag the mouse it will paint filled circles into the elevation map,
 * then send the elevation map to the generator to produce the output.
 */

import SimplexNoise from 'simplex-noise';
import { makeRandFloat } from '@redblobgames/prng';

const CANVAS_SIZE = 128;

/* The elevation is -1.0 to 0.0 → water, 0.0 to +1.0 → land */
class Generator {
    constructor() {
        this.userHasPainted = false;
        this.elevation = new Float32Array(CANVAS_SIZE * CANVAS_SIZE);
    }

    setElevationParam(elevationParam) {
        if (elevationParam.seed !== this.seed
            || elevationParam.island !== this.island) {
            this.seed = elevationParam.seed;
            this.island = elevationParam.island;
            this.generate();
        }
    }

    /** Use a noise function to determine the shape */
    generate() {
        const { elevation, island } = this;
        const noise = new SimplexNoise(makeRandFloat(this.seed));
        const persistence = 1 / 2;
        const amplitudes = Array.from({ length: 5 }, (_, octave) => Math.pow(persistence, octave));

        function fbm_noise(nx, ny) {
            let sum = 0, sumOfAmplitudes = 0;
            for (let octave = 0; octave < amplitudes.length; octave++) {
                let frequency = 1 << octave;
                sum += amplitudes[octave] * noise.noise2D(nx * frequency, ny * frequency);
                sumOfAmplitudes += amplitudes[octave];
            }
            return sum / sumOfAmplitudes;
        }

        for (let y = 0; y < CANVAS_SIZE; y++) {
            for (let x = 0; x < CANVAS_SIZE; x++) {
                let p = y * CANVAS_SIZE + x;
                let nx = 2 * x / CANVAS_SIZE - 1,
                    ny = 2 * y / CANVAS_SIZE - 1;
                let distance = Math.max(Math.abs(nx), Math.abs(ny));
                let e = 0.5 * (fbm_noise(nx, ny) + island * (0.75 - 2 * distance * distance));
                if (e < -1.0) { e = -1.0; }
                if (e > +1.0) { e = +1.0; }
                elevation[p] = e;
                if (e > 0.0) {
                    let m = (0.5 * noise.noise2D(nx + 30, ny + 50)
                        + 0.5 * noise.noise2D(2 * nx + 33, 2 * ny + 55));
                    // TODO: make some of these into parameters
                    let mountain = Math.min(1.0, e * 5.0) * (1 - Math.abs(m) / 0.5);
                    if (mountain > 0.0) {
                        elevation[p] = Math.max(e, Math.min(e * 3, mountain));
                    }
                }
            }
        }

        this.userHasPainted = false;
    }
}
let heightMap = new Generator();

export function screenToWorldCoords(coords, render) {
    let out = render.screenToWorld(coords);
    return [out[0] / 1000, out[1] / 1000];
}
export function onUpdate(generate) { generate(); }
export const size = CANVAS_SIZE;
export const constraints = heightMap.elevation;
export function setElevationParam(elevationParam) { return heightMap.setElevationParam(elevationParam); }
export function userHasPainted() { return heightMap.userHasPainted; }
