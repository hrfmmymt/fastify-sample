import * as workboxBuild from 'workbox-build';
// import * as fs from 'fs';
// import * as path from 'path';
// import { PostInfo } from './types';

// const postList = JSON.parse(
//   fs.readFileSync(path.join(__dirname, '../post-list.json'), 'utf8')
// )
// const globPatterns = postList.map((item: PostInfo) => `./${item.title}`);
// globPatterns.push('./**/*.{css,png,jpg,md}')

// NOTE: This should be run *AFTER* all your assets are built
const buildSW = () => {
  // This will return a Promise
  return workboxBuild.generateSW({
    globDirectory: './',
    globIgnores: ['./node_modules/**'],
    globPatterns: ['./**/*.{css,png,jpg,md}'],
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
    swDest: './sw.js',
  });
};

buildSW();
