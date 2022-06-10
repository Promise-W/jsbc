// 处理vue文件打包配置
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import {terser} from "rollup-plugin-terser";
// import resolve from 'rollup-plugin-node-resolve';
import { babel  } from '@rollup/plugin-babel';
// import styles from "rollup-plugin-styles";
import css from 'rollup-plugin-css-only'
// import nodePolyfills from 'rollup-plugin-polyfill-node'
import {nodeResolve} from '@rollup/plugin-node-resolve'
const path = require('path')

export default {
  input: path.resolve(__dirname, '../src/index.js'),
  plugins: [
    commonjs(),
    css({
      output: 'css/js-base-components.css'
    }), 
    vue({
      css: false
    }), 
    nodeResolve(),
    terser({
      ecma: 5
    }),
    babel({
      babelHelpers: 'bundled', 
      exclude: 'node_modules/**'
    })
  ],
  output: {
    file: 'dist/jsbc.js' ,
    format: 'umd',
    name: 'Vue',
    globals: {
      vue: 'Vue',
      element: 'element'
    }
  }
}