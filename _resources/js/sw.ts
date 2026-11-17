const cacheName = 'v1';
const cacheFiles: Array<string> = [
  '/',
  '/site.webmanifest',
];

const enableCache = typeof __ENABLE_CACHE__ !== undefined;

self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(install());
});

async function install(): Promise<void> {
  const cache = await caches.open(cacheName);
  return cache.addAll(cacheFiles);
}

self.addEventListener('fetch', (event: FetchEvent) => {
  if (!enableCache) {
    return;
  }

  const url = new URL(event.request.url);
  if (!cacheFiles.includes(url.pathname)) {
    return;
  }

  event.respondWith(cacheFetch(event.request));
});

/**
 * Fetches the request from the cache or network. This function implements a
 * stale-while-revalidate strategy, where it first tries to get the response
 * from the cache. If it is not found, it fetches it from the network and
 * caches it for future use. Subsequent requests will use the cached version
 * until it expires or is evicted, whilst simultaneously updating the
 * cache with the latest version from the network.
 */
async function cacheFetch(request: Request): Promise<Response> {
  const cache = await caches.open(cacheName);
  const asset = await cache.match(request);

  // Fetch the request from the network and update the cache.
  const fetchedResponse = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  // If the asset is found in the cache, return it. Otherwise, return the
  // fetched response.
  return asset || fetchedResponse;
}
