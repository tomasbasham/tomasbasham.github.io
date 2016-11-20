/* globals jQuery, document */

(function($) {
  'use strict';

  $(document).ready(function(){
    $('.post-content').fitVids();

    // Calculates Reading Time
    $('.post-content').readingTime({
      readingTimeTarget: '.post-reading-time',
      wordCountTarget: '.post-word-count',
    });

    // Creates Captions from Alt tags
    $('.post-content img').each(function() {
      // Let's put a caption if there is one
      if($(this).attr('alt') && !$(this).hasClass('emoji')) {
        $(this).wrap('<figure class="image"></figure>').after('<figcaption>'+$(this).attr('alt')+'</figcaption>');
      }
    });
  });
}(jQuery));

function openShare(event, providerName) {
  window.open(event.href, providerName + '-share', 'width=550,height=255');
  return false;
}
