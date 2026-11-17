import Alpine from 'alpinejs';

import DarkModeStore from '@/stores/dark-mode';
import DeskParallaxComponent from '@/components/desk-parallax';
import ParallaxHeadingComponent from '@/components/parallax-heading';
import SiteNavComponent from '@/components/site-nav';

import { initSmoothScrolling } from '@/utils/smooth-scrolling';

// Register application state with Alpine. State is used to store data that
// is shared across components and is some cases essential for the application
// to funciton. For example, the web push store is used to manage the state of
// the web push notifications, which is essential for the application to
// function correctly.
Alpine.store('darkMode', DarkModeStore);

Alpine.data('deskParallax', DeskParallaxComponent);
Alpine.data('parallaxHeading', ParallaxHeadingComponent);
Alpine.data('siteNav', SiteNavComponent);

Alpine.start();

// Make Alpine available globally available for a better developer experience.
window.Alpine = Alpine;

import * as serviceWorker from '@/service-worker';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.register();

console.log(
  '\n' +
  ' _/_/_/_/  _/_/_/_/  _/      _/    _/_/     _/_/_/\n' +
  '   _/     _/    _/  _/_/  _/_/  _/    _/  _/\n' +
  '  _/     _/    _/  _/  _/  _/  _/_/_/_/    _/_/_/\n' +
  ' _/     _/    _/  _/      _/  _/    _/          _/\n' +
  '_/     _/_/_/_/  _/      _/  _/    _/    _/_/_/\n' +
  '\n' +
  'Hi there, fellow developer! Thanks for visiting.\n' +
  'If you’re an aspiring bootstrapper, startup-er,\n' +
  'or business owner, and interested in working together\n' +
  'make sure to contact me at me@tomasbasham.dev\n' +
  '\n' +
  '— @tomasbasham\n' +
  '\n'
);

initSmoothScrolling();
