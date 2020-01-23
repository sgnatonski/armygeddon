import resolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import htmlTemplate from 'rollup-plugin-generate-html-template';
import commonjs from '@rollup/plugin-commonjs';
import dev from 'rollup-plugin-dev'
import livereload from 'rollup-plugin-livereload'
import replace from '@rollup/plugin-replace'
//import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/front/app/main.js',
    output: {
        format: 'iife',
        file: 'src/front/dist/app.js',
        sourcemap: true
    },
    plugins: [
        resolve({ browser: true, jsnext: true }),
        vue(),
        //vue({ needMap: false /* hack from https://github.com/vuejs/rollup-plugin-vue/issues/238 */ }),
        htmlTemplate({
            template: 'src/front/app/index.html',
            target: 'src/front/dist/index.html',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development') // production for PROD
        }),
        dev({
            dirs: ['src/front/dist', 'src/front/assets'],
            proxy: { '/*': 'localhost:3000' },
            port: 3001
        }),
        livereload(),
        commonjs(),
        //terser()
    ],
    onwarn: function (warning) {
        // Skip certain warnings

        // should intercept ... but doesn't in some rollup versions
        if (warning.code === 'THIS_IS_UNDEFINED') { return; }

        // console.warn everything else
        console.warn(warning.message);
    }
};