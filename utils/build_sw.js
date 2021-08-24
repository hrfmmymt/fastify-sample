const workboxBuild = require('workbox-build');

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.generateSW({
    globDirectory: './public',
    globPatterns: [
      '**/*.{js,css,png,jpg}',
      'post/*.md',
    ],
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    swDest: 'public/sw.js',
  });
};

buildSW();
