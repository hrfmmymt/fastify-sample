const CACHENAME = '::iiyatsu_serviceworker';
const VERSION = 'v0.0.1';
const OFFLINEFALLBACKPAGE = 'offline.html';
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

const preLoad = async () => {
  console.log('Installing web app');
  try {
    const cache = await caches.open(VERSION + CACHENAME);
    const cachedUrls = cache.addAll(URLS_TO_CACHE);
    return cachedUrls;
  } catch (error) {
    console.error(error);
  }
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(preLoad());
  console.log('installed latest version');
});

const makeNetWorkRequest = (request) =>
  new Promise(async (resolve, reject) => {
    try {
      const networkFetchResponse = await fetch(request);
      if (networkFetchResponse.status !== 404) {
        resolve(networkFetchResponse);
      } else {
        throw new Error('no resource found');
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });

const returnFromCache = async (request) => {
  try {
    const cache = await caches.open(VERSION + CACHENAME);
    const cacheItemMatchingNetworkRequest = await cache.match(request);
    if (
      !cacheItemMatchingNetworkRequest ||
      cacheItemMatchingNetworkRequest.status == 404
    ) {
      return cache.match('/');
    } else {
      return cacheItemMatchingNetworkRequest;
    }
  } catch (error) {
    console.error(error);
  }
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    makeNetWorkRequest(event.request).catch(() => {
      return returnFromCache(event.request);
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function () {
  const offlinePageRequest = new Request(OFFLINEFALLBACKPAGE);

  return fetch(OFFLINEFALLBACKPAGE).then(function (response) {
    return caches.open(VERSION + CACHENAME).then(function (cache) {
      console.log(
        '[PWA Builder] Offline page updated from refreshOffline event: ' +
          response.url
      );
      return cache.put(offlinePageRequest, response);
    });
  });
});
