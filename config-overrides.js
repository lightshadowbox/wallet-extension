const { addReactRefresh } = require('customize-cra-react-refresh')
const { override, overrideDevServer, addWebpackPlugin, addPostcssPlugins } = require('customize-cra')
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
    )(config, env)
    return config
  },
}
