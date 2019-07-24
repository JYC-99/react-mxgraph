module.exports = ({ config, mode }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      presets: [['react-app', { flow: false, typescript: true }]],
    },
  }, {
    test: /\.scss$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader"
      ]
  }, {
    test: /\.css$/,
    exclude: /node_modules(?!\/@storybook\/addon-info)/,
    use: ['style-loader', 'css-loader'],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};