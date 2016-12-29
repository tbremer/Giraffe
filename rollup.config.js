import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import clean from './lib/rollup-plugin-clean';
import nodeResolve from 'rollup-plugin-node-resolve';

const shouldMinify = ('MIN' in process.env);

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'Giraffe',
  plugins: [
    nodeResolve(),
    babel({
      presets: [ 'es2015-rollup' ],
      plugins: [ 'transform-object-assign' ],
      babelrc: false
    }),
    shouldMinify ? uglify() : clean()
  ],
  dest: `dist/bundle${shouldMinify ? '.min' : ''}.js`
};
