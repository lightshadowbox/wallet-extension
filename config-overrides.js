const { addReactRefresh } = require('customize-cra-react-refresh')
const { override, overrideDevServer, addWebpackPlugin, addPostcssPlugins } = require('customize-cra')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const WorkerPlugin = require('worker-plugin')


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

      addWebpackPlugin(new WorkerPlugin()),
      // addWebpackPlugin(new CopyPlugin({
      //   patterns: [
      //     { from: 'public/**', to: 'build', flatten: true, globOptions: {ignore: ['public/index.html' ]} },
      //   ],
      // }),)
    )(config, env)
    config.output.filename = 'static/js/[name].bundle.js'
    return config
  },
}
