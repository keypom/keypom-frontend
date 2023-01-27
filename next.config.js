module.exports = {
  reactStrictMode: true,
  // compiler: {
  //   emotion: true,
  // },
  // // https://github.com/ItsWendell/next-edge-runtime-chakra-ui-emotion/blob/main/next.config.js
  // webpack: (config, ctx) => {
  //   if (ctx.nextRuntime === 'edge') {
  //     if (!config.resolve.conditionNames) {
  //       config.resolve.conditionNames = ['require', 'node'];
  //     }
  //     if (!config.resolve.conditionNames.includes('worker')) {
  //       config.resolve.conditionNames.push('worker');
  //     }
  //   }
  //   return config;
  // },
  experimental: {
    // unable to build with Edge. See https://github.com/vercel/next.js/issues/40379
    // runtime: 'edge',
    appDir: true,
  },
};
