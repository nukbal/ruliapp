module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        alias: {
          components: './app/components',
          config: './app/config',
          hooks: './app/hooks',
          stores: './app/stores',
          styles: './app/styles',
          utils: './app/utils',
        },
      },
    ],
  ],
};
