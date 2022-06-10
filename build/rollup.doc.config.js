// 文档配置

import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import {terser} from "rollup-plugin-terser";
// import resolve from 'rollup-plugin-node-resolve';
import { babel  } from '@rollup/plugin-babel';
// import styles from "rollup-plugin-styles";
// import nodePolyfills from 'rollup-plugin-polyfill-node'
import {nodeResolve} from '@rollup/plugin-node-resolve'
// import html from '@rollup/plugin-html'
import html2 from 'rollup-plugin-html2'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import extensions from 'rollup-plugin-extensions';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import image from '@rollup/plugin-image'
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
const path = require('path')

export default {
  input: path.resolve(__dirname, '../doc/entry.js'),
  plugins: [
    
    postcss({
      plugins: []
    }),
    vue({
      css: false
    }),
    image(),
    alias({
      entries: [
        { find: 'main', replacement: path.resolve(__dirname, '../doc')}
      ]
    }),
    extensions({
      extensions: ['.vue', '.js'],
      resolveIndex: true,
    }),
    json(),
    
    nodeResolve(),
    terser({
      ecma: 5
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
    }),
    globals(),
    builtins(),
    
    html2({
      template: './doc/index.tpl',
      fileName: './index.html',
      onlinePath: './'
    }),
    serve({
      open: true,
      host: 'localhost',
      port: 10001,
      openPage: '/dist/doc/index.html'
    }), // index.html should be in root of project
    livereload({
      watch: 'dist/doc',
      verbose: false,
      delay: 300
    }),
  ],
  external: [
    'vue',
    'vue-router',
    path.resolve(__dirname, '../doc/require.js')
  ],
  output: {
    dir: 'dist/doc' ,
    format: 'umd',
    globals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
    },
  }
}