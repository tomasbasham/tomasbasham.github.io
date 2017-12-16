/* globals define, document */

define(['domReady', 'jquery'], function(domReady, $) {
  domReady(function() {
    // Print contact info
    console.log(document.childNodes[1].textContent);
  });
});
