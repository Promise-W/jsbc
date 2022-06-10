import {terser} from "rollup-plugin-terser";
// import resolve from 'rollup-plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
const path = require('path')
const fs = require('fs')

const exportArr = []
export const readPath = function (pathName) {
  return new Promise((resolve1, reject) => {
    fs.readdir(path.resolve(__dirname, pathName), (err, file) => {
      file.forEach(function (filename) {
        exportArr.push({
          input: path.resolve(__dirname, pathName + filename),
          plugins: [terser({
            ecma: 5
          }), babel({ babelHelpers: 'bundled' })],
          output: {
            file: path.resolve(__dirname, '../dist/' + filename.split('.js')[0] + '.min.js'),
            format: 'umd',
            name: filename
          }
        })
        
      })
      resolve1(exportArr)
    })
  })
}