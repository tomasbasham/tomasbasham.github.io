/* globals requirejs */

requirejs.config({
  baseUrl: '/js/lib',
  paths: {
    app: '../app',
    domReady: '//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    jquery: '//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min'
  },

  // Remember: only use shim config for non-AMD scripts, scripts that do not
  // already call define(). The shim config will not work correctly if used on
  // AMD scripts, in particular, the exports and init config will not be
  // triggered, and the deps config will be confusing for those cases.
  shim: {
    'jquery.fitvids.min': ['jquery'],
    'jquery.readingTime.min': ['jquery'],
  }
});

requirejs(['app/banner', 'app/parallax', 'app/posts', 'app/social']);
