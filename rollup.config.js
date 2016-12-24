import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const shouldMinify = ('MIN' in process.env);

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [ babel(),  shouldMinify ? uglify() : () => {} ],
  dest: `dist/bundle${shouldMinify ? '.min' : ''}.js`
};
