/*
 * From http://www.redblobgames.com/maps/mapgen4/
 * Copyright 2018 Red Blob Games <redblobgames@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import param from '@internal/common/mapgen/core/config';
import MakeMesh from './mesh';
import * as Painting from './painting';
import Renderer from './render';
import Map from './map.js';
import { setMapGeometry, setRiverTextures } from './geometry.js';

const initialParams = {
    elevation: [
        ['seed', 187, 1, 1 << 30],
        ['island', 0.5, 0, 1],
        ['noisy_coastlines', 0.01, 0, 0.1],
        ['hill_height', 0.02, 0, 0.1],
        ['mountain_jagged', 0, 0, 1],
        ['ocean_depth', 1.5, 1, 3],
    ],
    biomes: [
        ['wind_angle_deg', 0, 0, 360],
        ['raininess', 0.9, 0, 2],
        ['rain_shadow', 0.5, 0.1, 2],
        ['evaporation', 0.5, 0, 1],
    ],
    rivers: [
        ['lg_min_flow', 2.7, -5, 5],
        ['lg_river_width', -2.7, -5, 5],
        ['flow', 0.2, 0, 1],
    ],
    render: [
        ['zoom', 100 / 480, 100 / 1000, 100 / 50],
        ['x', 500, 0, 1000],
        ['y', 500, 0, 1000],
        ['light_angle_deg', 80, 0, 360],
        ['slope', 2, 0, 5],
        ['flat', 2.5, 0, 5],
        ['ambient', 0.25, 0, 1],
        ['overhead', 30, 0, 60],
        ['tilt_deg', 0, 0, 90],
        ['rotate_deg', 0, -180, 180],
        ['mountain_height', 50, 0, 250],
        ['outline_depth', 1, 0, 2],
        ['outline_strength', 15, 0, 30],
        ['outline_threshold', 0, 0, 100],
        ['outline_coast', 0, 0, 1],
        ['outline_water', 10.0, 0, 20], // things start going wrong when this is high
        ['biome_colors', 1, 0, 1],
    ],
};


/** @typedef { import("@internal/common/mapgen/types").Mesh } Mesh */

/**
 * Starts the UI, once the mesh has been loaded in.
 *
 * @param {{mesh: Mesh, peaks_t: number[]}} _
 */
function main({ mesh, peaks_t }) {
    let render = new Renderer(mesh);

    /* set initial parameters */
    for (let phase of ['elevation', 'biomes', 'rivers', 'render']) {
        for (let [name, initialValue, min, max] of initialParams[phase]) {
            param[phase][name] = initialValue;
        }
    }

    const map = new Map(mesh, peaks_t, param);
    // TODO: placeholder
    const run = { elevation: true, biomes: true, rivers: true };

    Painting.setElevationParam(param.elevation);

    let numRiverTriangles = 0;

    if (run.elevation) {
        map.assignElevation(param.elevation, {
            size: Painting.size,
            constraints: Painting.constraints,
        });
    }
    if (run.biomes) { map.assignRainfall(param.biomes); }
    if (run.rivers) { map.assignRivers(param.rivers); }
    if (run.elevation || run.rivers) {
        setMapGeometry(map, new Int32Array(render.quad_elements.buffer), new Float32Array(render.a_quad_em.buffer));
    }
    if (run.rivers) { numRiverTriangles = setRiverTextures(map, param.spacing, param.rivers, new Float32Array(render.a_river_xyuv.buffer)); }

    render.quad_elements = new Int32Array(render.quad_elements.buffer);
    render.a_quad_em = new Float32Array(render.a_quad_em.buffer);
    render.a_river_xyuv = new Float32Array(render.a_river_xyuv.buffer);
    render.numRiverTriangles = numRiverTriangles;
    render.updateMap();
    render.updateView(param.render);
}

export default async () => {
    const mesh = await MakeMesh.makeMesh();
    main(mesh);
}
