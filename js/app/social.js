/* globals define, window */

define(['domReady', 'jquery'], function(domReady, $) {
  domReady(function() {
    socialLinks = $('.social-link');
    socialLinks.click(function(event) {
      event.preventDefault();

      var href = $(this).attr('href');
      var providerName = $(this).data('providerName');
      window.open(href, providerName + '-share', 'width=550,height=255');
    });
  });
});
