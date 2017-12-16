/* globals define, document */

define(['domReady', 'jquery'], function(domReady, $) {
  domReady(function() {
    $document = $(document);

    // Print contact info
    var banner = $document.contents().filter(function() {
      return this.nodeType == 8;
    })[0];

    console.log(banner);
  });
});
