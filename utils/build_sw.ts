import * as workboxBuild from 'workbox-build';

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.generateSW({
    globDirectory: './',
    globIgnores: ['./node_modules/**'],
    globPatterns: ['./**/*.{css,png,jpg}'],
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    swDest: 'public/sw.js',
  });
};

buildSW();
