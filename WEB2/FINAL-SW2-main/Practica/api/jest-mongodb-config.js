module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.5',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },

  useSharedDBForAllJestWorkers: false,
}
