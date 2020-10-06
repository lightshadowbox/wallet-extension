const { addReactRefresh } = require('customize-cra-react-refresh')
const { override, overrideDevServer, addWebpackPlugin, addPostcssPlugins } = require('customize-cra')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
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
      // addWebpackPlugin(new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: true })),
      addWebpackPlugin(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      ),
      addWebpackPlugin(copyPlugin),
    )(config, env)

    if (process.env.TARGET === 'background') {
      config.entry = path.resolve('./src/background/main.ts')
      config.output.filename = 'bundle.[name].js'
      config.output.path = __dirname + '/dist/background'
      config.plugins[0].options.template = path.resolve('./public/background.html')
    }

    config.optimization.runtimeChunk = false
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    }
    config.bail = true
    // const fs = require('fs')
    // fs.appendFile(`${process.env.TARGET}.config.log`, JSON.stringify(config, null, 2), () => console.log('ahihih'))
    return config
  },
  devServer: overrideDevServer(devServerConfig()),
}
