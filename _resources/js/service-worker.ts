const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

/**
  * Registration configuration object. The configuration object is used to
  * define the success and update callbacks for the service worker registration.
  */
type RegistrationConfig = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

/**
 * Register the service worker.
 *
 * @param config RegistrationConfig The registration configuration.
 */
export function register(config?: RegistrationConfig) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    registerServiceWorker(config);
  });
}

/**
 * Unregister the service worker.
 */
export function unregister() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  }).catch(error => {
    console.error('Failed to unregister service worker:', error);
  });
}

/**
 * Register the service worker.
 *
 * @param config RegistrationConfig The registration configuration.
 */
function registerServiceWorker(config?: RegistrationConfig) {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  if (isLocalhost) {
    navigator.serviceWorker.ready.then(() => {
      console.info('This web app is being served cache-first by a service worker');
    }).catch(error => {
      console.error('Service worker registration failed:', error);
    });
  }

  navigator.serviceWorker.register('/sw.js').then(registration => {
    manageRegistration(registration, config);
  }).catch(error => {
    console.error('Failed to register service Worker:', error);
  });
}

/**
 * Manage the service worker lifecycle.
 *
 * @param registration ServiceWorkerRegistration The service worker registration.
 * @param config RegistrationConfig The registration configuration.
 */
function manageRegistration(registration: ServiceWorkerRegistration, config?: RegistrationConfig) {
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    if (!installingWorker) {
      return;
    }

    installingWorker.onstatechange = () => {
      if (installingWorker.state !== 'installed') {
        return;
      }

      if (!navigator.serviceWorker.controller) {
        console.log('Content is cached for offline use.');
        config?.onSuccess?.(registration);
      }

      config?.onUpdate?.(registration);
    };
  };
}
