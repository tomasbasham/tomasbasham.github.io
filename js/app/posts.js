/* globals define */

define(['domReady', 'jquery', 'jquery.fitvids.min', 'jquery.readingTime.min'], function(domReady, $) {
  domReady(function() {
    $('.post-content').fitVids();

    // Calculates reading time
    $('.post-content').readingTime({
      readingTimeTarget: '.post-reading-time',
      wordCountTarget: '.post-word-count',
    });

    // Creates captions from alt tags
    $('.post-content img').each(function() {
      // Let's put a caption if there is one
      if($(this).attr('alt') && !$(this).hasClass('emoji')) {
        $(this).wrap('<figure class="image"></figure>').after('<figcaption>'+$(this).attr('alt')+'</figcaption>');
      }
    });
  });
});
