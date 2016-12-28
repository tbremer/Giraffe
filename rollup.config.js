import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const shouldMinify = ('MIN' in process.env);

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'Giraffe',
  plugins: [
    babel({
      presets: [ 'es2015-rollup' ],
      plugins: [ 'transform-object-assign' ],
      babelrc: false
    }),
    shouldMinify ? uglify() : () => {}
  ],
  dest: `dist/bundle${shouldMinify ? '.min' : ''}.js`
};
