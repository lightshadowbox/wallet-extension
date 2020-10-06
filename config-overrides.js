const { addReactRefresh } = require('customize-cra-react-refresh')
const { override, overrideDevServer, addWebpackPlugin, addPostcssPlugins } = require('customize-cra')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const devServerConfig = () => (config) => {
  return {
    ...config,
    writeToDisk: true,
  }
}

const copyPlugin = new CopyPlugin({
  patterns: [
    // copy assets
    { from: 'public', to: '' },
  ],
})

module.exports = {
  webpack: function (config, env) {
    config = override(
      addPostcssPlugins([
        require('tailwindcss')('./tailwind.config.js'),
        require('postcss-nested'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
          features: {
            'custom-properties': false,
          },
        }),
      ]),
      addReactRefresh(),
      addWebpackPlugin(new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: true })),
      addWebpackPlugin(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ),
      addWebpackPlugin(copyPlugin),
    )(config, env)

    if (env === 'background') {
      config.entry = path.resolve('./src/background/main.ts')
      config.output.filename = 'bundle.background.js'
    }
    config.optimization.runtimeChunk = false
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    }
    config.bail = true
    return config
  },
  devServer: overrideDevServer(devServerConfig()),
}
