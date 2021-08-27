const CACHENAME = '::iiyatsu_serviceworker';
const VERSION = 'v0.0.1';
const OFFLINEFALLBACKPAGE = 'offline.html';
const URLS_TO_CACHE = ['./', './sw.js'];

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
