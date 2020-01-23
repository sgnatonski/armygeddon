import resolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import htmlTemplate from 'rollup-plugin-generate-html-template';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import replace from '@rollup/plugin-replace'
//import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/front/app/main.js',
    output: {
        format: 'iife',
        file: 'src/front/dist/app.js'
    },
    plugins: [
        resolve({ browser: true, jsnext: true }),
        vue(),
        htmlTemplate({
            template: 'src/front/app/index.html',
            target: 'src/front/dist/index.html',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development') // production for PROD
        }),
        serve(['src/front/dist', 'src/front/assets']),
        livereload(),
        commonjs(),
        //terser()
    ]
};