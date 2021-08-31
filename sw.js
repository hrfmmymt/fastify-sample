const CACHENAME = '::iiyatsu_serviceworker';
const VERSION = 'v0.0.1';
const OFFLINEFALLBACKPAGE = './public/offline.html';
const URLS_TO_CACHE = [
  "./",
  "./sw.js",
  "./ESM%E5%AF%BE%E5%BF%9C%E3%81%B8%E3%81%AE%E6%87%B8%E5%BF%B5",
  "./hello-world!",
  "./0",
  "./1",
  "./public/css/style.css",
  "./public/img/icon/favicon.ico",
  "./public/img/icon/icon-128x128.png",
  "./public/img/icon/icon-144x144.png",
  "./public/img/icon/icon-152x152.png",
  "./public/img/icon/icon-192x192.png",
  "./public/img/icon/icon-384x384.png",
  "./public/img/icon/icon-512x512.png",
  "./public/img/icon/icon-72x72.png",
  "./public/img/icon/icon-96x96.png",
  "./public/img/icon/icon.png",
  "./public/img/post/20210829_01.jpg",
  "./public/img/post/20210829_02.jpg",
  "./public/img/post/PXL_20210809_112724993.PORTRAIT.jpg",
  "./public/img/post/raw/20210829_01.jpg",
  "./public/img/post/raw/20210829_02.jpg",
  "./public/img/post/webp/20210829_01.webp",
  "./public/img/post/webp/20210829_02.webp",
  "./public/img/post/webp/PXL_20210809_112724993.PORTRAIT.webp",
  "./public/img/profile/profile.jpg",
  "./public/img/profile/profile.webp",
  "./public/js/script.js",
  "./public/manifest.json",
  "./public/videos/poster/kitakyushu-2019-01.png",
  "./public/videos/poster/test.jpg",
  "./public/videos/poster/test.png"
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
