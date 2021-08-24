module.exports = {
  globDirectory: './',
  globPatterns: [
    'public/**/*.{css,png,html}',
    'templates/*.njk',
    'posts-list.json',
    'post/*.md',
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swDest: 'public/js/sw.js',
};
