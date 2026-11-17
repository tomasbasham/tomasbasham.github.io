import { Alpine as AlpineType } from 'alpinejs';

declare global {
  var Alpine: AlpineType;

  // Feature flags.
  const __ENABLE_CACHE__: string;
}
