module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
        );
      }

      const { dev, isServer } = options;
      const { assetPrefix = '', urlLoaderOptions } = nextConfig;

      options.defaultLoaders.assetsImport = {
        loader: "url-loader",
        options: Object.assign(
          {},
          {
            emitFile: !isServer,
            limit: 8192,
            name: `static/[path][${dev ? "name" : "hash"}].[ext]`,
            publicPath: `${assetPrefix}/_next/`
          },
          urlLoaderOptions
        )
      };

      config.module.rules.push({
        test: /\.(bmp|gif|jpe?g|png|svg|ttf|eot|woff2?|mp3|wav|mp4|ogg|webm)$/,
        use: options.defaultLoaders.assetsImport
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    }
  });
};
