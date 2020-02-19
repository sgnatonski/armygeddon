import resolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import htmlTemplate from 'rollup-plugin-generate-html-template';
import commonJS from '@rollup/plugin-commonjs';
import dev from 'rollup-plugin-dev'
import livereload from 'rollup-plugin-livereload'
import replace from '@rollup/plugin-replace'
import { terser } from "rollup-plugin-terser";
import clear from 'rollup-plugin-clear'

const isProduction = process.env.production;
const distDir = 'src/front/dist';

export default [
    {
        external: ['bhex'],
        input: 'src/common/bhex/BHex.Drawing.js',
        output: {
            format: 'es',
            file: `${distDir}/bhex.js`
        },
        plugins: isProduction ?
            [
                clear({ targets: [distDir] }),
                commonJS(),
                terser()
            ] :
            [
                clear({ targets: [distDir] }),
                commonJS()
            ]
    },
    {
        external: ['konva', 'vue'],
        input: 'src/front/app/main.js',
        output: {
            format: 'iife',
            file: `${distDir}/app.js`,
            sourcemap: !isProduction,
            globals: {
                'konva': 'Konva',
                'vue': 'Vue'
            }
        },
        plugins: isProduction ?
            [
                clear({ targets: [distDir] }),
                vue({ needMap: false /* hack from https://github.com/vuejs/rollup-plugin-vue/issues/238 */ }),
                htmlTemplate({
                    template: 'src/front/app/index.html',
                    target: `${distDir}/index.html`,
                    attrs: [ 'defer' ],
                }),
                replace({
                    'process.env.NODE_ENV': '"production"'
                }),
                resolve({
                    jsnext: true, browser: true
                }),
                commonJS(),
                terser()
            ] :
            [
                clear({ targets: [distDir] }),
                vue({ needMap: false /* hack from https://github.com/vuejs/rollup-plugin-vue/issues/238 */ }),
                htmlTemplate({
                    template: 'src/front/app/index.html',
                    target: `${distDir}/index.html`,
                    attrs: [ 'defer' ],
                }),
                replace({
                    'process.env.NODE_ENV': '"development"'
                }),
                resolve({
                    jsnext: true, browser: true
                }),
                commonJS(),
                dev({
                    dirs: [distDir, 'src/front/assets'],
                    proxy: { '/*': 'localhost:3000' },
                    port: 3001
                }),
                livereload(),
            ],
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED') { return; }

            console.warn(warning.message);
        }
    }];