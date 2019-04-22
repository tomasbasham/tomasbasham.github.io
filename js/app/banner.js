/* globals define, document */

define(['domReady'], function(domReady) {
  domReady(function() {
		if( typeof console === 'object' ) {
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
        'make sure to contact me at tomasbasham@gmail.com\n' +
				'\n' +
				'— @tomasbasham\n' +
				'\n'
			);
		}
  });
});
