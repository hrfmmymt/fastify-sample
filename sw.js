const CACHENAME = '::iiyatsu_serviceworker';
const VERSION = 'v0.0.1';
const OFFLINEFALLBACKPAGE = './public/offline.html';
const URLS_TO_CACHE = [
  './',
  './sw.js',
  './0',
  './1%E3%81%AE%E3%82%B3%E3%83%92%E3%82%9A%E3%83%BC',
  './1',
  './public/css/style.css',
  './public/img/icons/favicon.ico',
  './public/img/icons/icon-128x128.png',
  './public/img/icons/icon-144x144.png',
  './public/img/icons/icon-152x152.png',
  './public/img/icons/icon-192x192.png',
  './public/img/icons/icon-384x384.png',
  './public/img/icons/icon-512x512.png',
  './public/img/icons/icon-72x72.png',
  './public/img/icons/icon-96x96.png',
  './public/img/icons/icon.png',
  './public/img/profile/profile.jpg',
  './public/img/profile/profile.webp',
  './public/js/script.js',
  './public/manifest.json',
];

self.addEventListener('install', (event) => {
  console.log('The service worker is being installed.');
  self.skipWaiting();
  event.waitUntil(
    caches.open(VERSION + CACHENAME).then((cache) => {
      cache.addAll(URLS_TO_CACHE);
    }, console.err)
  );
});

const fromCache = (request) => {
  return caches.open(VERSION + CACHENAME).then((cache) => {
    return cache.match(request);
  });
};

const update = (request) => {
  return caches.open(VERSION + CACHENAME).then((cache) => {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(() => {
        return response;
      });
    });
  });
};

const refresh = (response) => {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      const message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag'),
      };
      client.postMessage(JSON.stringify(message));
    });
  });
};

self.addEventListener('fetch', (event) => {
  console.log('The service worker is serving the asset.');
  event.respondWith(fromCache(event.request));
  event.waitUntil(update(event.request).then(refresh));
});
