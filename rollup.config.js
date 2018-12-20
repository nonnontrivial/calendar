import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
// import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import { main, module } from './package.json';

let root = process.platform === 'win32' ? path.resolve('/') : '/';
let external = id => !id.startsWith('.') && !id.startsWith(root);

export default {
  onwarn: () => {},
  external,
  input: 'src/index.js',
  output: [{ file: main, format: 'cjs' }, { file: module, format: 'esm' }],
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
      plugins: [['@babel/transform-runtime', { regenerator: false }]]
    }),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // }),
    resolve(),
    commonjs()
  ]
};
