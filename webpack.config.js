const isProduction = 'NODE_ENV' in process.env && process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.js',
  output: {
    filename: `giraffe${isProduction ? '.min' : ''}.js`,
    path: `${process.cwd()}/dist/`
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  }
};
