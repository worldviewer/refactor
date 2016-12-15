import Infographic from './infographic.js';
import kinetic from '../../node_modules/jquery.kinetic/jquery.kinetic.js';
import utils from './utils.js';

export default class DesktopInfographic {
	constructor() {
		console.log('desktop or tablet window.load()');
	}

	init() {
		// Initialize impress.js presentation scale to 1
		$('#impress').attr('data-set-scale-factor', 1);

		// Initialize Materialize tooltip
		$('.tooltipped').tooltip({delay: 50});

		// Initialize Materialize sideNav
		$('.button-collapse').sideNav({
			menuWidth: 360 // Default is 240
		});

		// Always start infographic with active side-nav bar
		$('.button-collapse').sideNav('show');
		$('#slide-out').addClass('active');

		this.showControls();

		Materialize.toast('Use < and > keys to navigate', 10000);

		this.showSideNav();

		$('.big-image').show();

		setTimeout(() => {
			$('.preloader-wrapper').removeClass('active');
			$('.big-image').addClass('animated fadeIn').css('visibility', 'visible');

			this.loadImpress();
		}, 4000);		
	}

	showControls() {
		$('#page-up').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#page-down').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#mobile-view').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#zoom-in').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#zoom-out').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#previous-slide').addClass('animated fadeInUp').css('visibility', 'visible')
		$('#next-slide').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#discuss-slide').addClass('animated fadeInRight').css('visibility', 'visible');
	}

	showSideNav() {
		$('#slide-out').show();
		$('#slide-out').addClass('animated fadeInLeft').css('visibility', 'visible');
	}

	loadImpress() {
		let setup = () => this.setupHandlers();

		// Add in drag scroll once all animations have completed.  For some reason,
		// I'm not able to get the deceleration to work for this, even when I modify
		// the slowdown value in the original code ...
		$(window).kinetic();

		utils.loadScript("dist/js/impress.js", setup);
	}

	setupHandlers() {
		impress().init();

		this.setupHamburger();
		this.setupHashChange();
		this.setupMobileChange();
		this.setupZooms();
		this.setupDiscuss();
		this.setupNextPrev();
		this.setupKeypresses();
	}

	setupHamburger() {
		// Allow side-nav collapse by pressing the hamburger icon
		$('.button-collapse').on('click', function() {
			// $("#slide").animate({width:'toggle'},350);
			// $('.button-collapse').sideNav('hide');
			$('#slide-out').removeClass('active');

			$('#hamburger').css('visibility', 'visible');

			console.log("collapse side-nav");
		});

		// Show side-nav bar when corner hamburger is clicked
		$('#hamburger').on('click', function() {
			$('.button-collapse').sideNav('show');
			$('#slide-out').addClass('active');
			$('#hamburger').css('visibility', 'hidden');
		});
	}

	setupHashChange() {
		// DECORATING LIST ITEM BORDER FOR CONTENT SLIDES
		// (URL CHANGE --> LI CHANGE)
		// $('#impress > .present').attr('id') can be used to grab the id that is currently
		// activated by impress.js, and with that, we can can apply border styling to
		// the right border of $('.side-nav > li[id="id"');

		$(window).on('hashchange', function(e){
			console.log('slide transition');

			// grab active impress.js slide ID
			var currentSlideHash = $('#impress .active').attr('id');

			// Reality-check to console
			console.log("current slide hash: " + currentSlideHash);

			// toggle the active-slide class for the list item with that ID
			$('.side-nav > li').removeClass('active-slide');
			$('.side-nav li[data-slide=\"' + currentSlideHash + '\"]').toggleClass('active-slide');
		});

		// MOVING INFOGRAPHIC FOCUS BASED UPON CLICKS TO SIDE-NAV
		// (LI CLICK --> URL CHANGE)
		// clicks on $('.side-nav > li') should grab data('slide'), and window.location.hash = 
		// '#your-page-element';

		$('.side-nav > li').on('click', function() {
			console.log('click-induced transition');
			window.location.hash = '#' + $(this).data('slide');
		});

		$('#page-up').on('click', function() {
			window.location.hash = '#intro';
		});

		$('#page-down').on('click', function() {
			window.location.hash = '#futurism';
		});
	}

	setupMobileChange() {
		// I want to persist this setting between sessions, so I'll use js.cookie.js
		// Usage information here ...
		// https://github.com/js-cookie/js-cookie
		//
		// Cookies.set('name', 'value');
		//
		// Valid across entire site ...
		// Cookies.set('name', 'value', { expires: 7 });
		// 
		// Cookies.get('name'); // => 'value'
		// Cookies.get('nothing'); // => undefined

		$('#mobile-view').on('click', function() {
			Cookies.set('display', 'mobile', {expires: 365});

			console.log("display: " + Cookies.get('display'));

			// Then reload the page ...
			document.location.reload();
		});
	}

	setupZooms() {
		// jQuery automatically adds in necessary vendor prefixes when using
		// .css().  See https://css-tricks.com/how-to-deal-with-vendor-prefixes/.
		$('#zoom-in').on('click', function() {
			$('#impress').css('transform', 'scale(' + utils.getScale("impress")*1.25 + ')');
		});

		$('#zoom-out').on('click', function() {
			$('#impress').css('transform', 'scale(' + utils.getScale("impress")/1.25 + ')');
		});
	}

	setupDiscuss() {
		$('#discuss-slide').on('click', function() {

		});
	}

	setupNextPrev() {
		$('#previous-slide').on('click', function() {
			// This approach does not work because it does not preventDefault(),
			// and the key is already being captured by impress.js, which causes
			// a conflict ...

			// var e = jQuery.Event("keydown");
			// e.which = 37;
			// e.keyCode = 37;
			// $(document).trigger(e);

			// Instead, we can in this case just use impress ...
			impress().prev();

			// And see below for an example of how to capture keypresses in other
			// cases ...
		});

		$('#next-slide').on('click', function() {
			impress().next();
		});
	}

	setupKeypresses() {
		var count = 0;
		var current, start, end, previous, diff, factor;

		// Define shortcuts here
		// REFACTOR THIS
		$(document).keydown(function(e) {
			// When plus or minus is hit, count the number of times

			if ((e.keyCode === 9) || (e.keyCode === 189) || 
				(e.keyCode === 187) || (e.keyCode === 13)) {
                e.preventDefault();
            }

		    console.log("key code: " + e.keyCode);

			// Use ENTER key to set the scale for all slides
			// if (e.keyCode === 13) {
			// 	factor = $('#impress').attr('data-scale-factor');
			// 	$('#impress').attr('data-set-scale-factor', factor);
			// 	console.log('Set scale to active');
			// }

		    // TAB key: Use tab key as a shortcut for toggling the side-nav
		    if (e.keyCode === 9) {
		    	if ($('#slide-out').hasClass('active')) {
					$('.button-collapse').trigger('click');
				} else {
					$('#hamburger').trigger('click');
				}

		    } else if ((e.keyCode === 189) || (e.keyCode === 187)) {

				// Subtract key: Use for zooming out
			    if (e.keyCode === 189) {
			    	current = Date.now();
					console.log("current: " + current);
					console.log("previous: " + previous);
					diff = parseInt(current) - parseInt(previous);
					console.log("diff: " + diff);

					// First keypress in a series
					if (count === 0) {
						start = current;
						count++;
						console.log('count: ' + count);

						setTimeout(function(currentCount) {
							console.log('count: ' + count + ", currentCount: " + currentCount);
							if (currentCount === count) {
								factor = Math.pow(Math.log(count+2), 3);
								$('#impress').css('transform', 'scale(' + utils.getScale("impress")/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
								// setScaleFactor(-factor);
								count = 0;
							}
						}, 500, count);

						previous = current;

					// This keypress occurred within half a second of the last
					} else {
						if (parseInt(current) - parseInt(previous) < 250) {
							count++;
							console.log('count: ' + count);

							// Wait half a second and check to see if any more of these same
							// keypresses have occurred.  If not, then currentCount will equal
							// the count.  It is only then that we want to calculate and invoke
							// the zoom function
							setTimeout(function(currentCount) {
								console.log('count: ' + count + ", currentCount: " + currentCount);
								if (currentCount === count) {
									factor = Math.pow(Math.log(count+2), 3);
									$('#impress').css('transform', 'scale(' + utils.getScale("impress")/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
									// setScaleFactor(-factor);
									count = 0;
								}
							}, 500, count);
						}

						previous = current;								
					}

				// Add key: Use for zooming in						
			    } else if (e.keyCode === 187) {
			    	current = Date.now();
					console.log("current: " + current);
					console.log("previous: " + previous);
					diff = parseInt(current) - parseInt(previous);
					console.log("diff: " + diff);

					// First keypress in a series
					if (count === 0) {
						start = current;
						count++;
						console.log('count: ' + count);

						setTimeout(function(currentCount) {
							console.log('count: ' + count + ", currentCount: " + currentCount);
							if (currentCount === count) {
								factor = Math.pow(Math.log(count+2), 3);
								$('#impress').css('transform', 'scale(' + utils.getScale("impress")*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
								// setScaleFactor(factor);
								count = 0;
							}
						}, 500, count);

						previous = current;	

					// This keypress occurred within half a second of the last
					} else {
						if (parseInt(current) - parseInt(previous) < 250) {
							count++;
							console.log('count: ' + count);

							// Wait half a second and check to see if any more of these same
							// keypresses have occurred.  If not, then currentCount will equal
							// the count.  It is only then that we want to calculate and invoke
							// the zoom function
							setTimeout(function(currentCount) {
								console.log('count: ' + count + ", currentCount: " + currentCount);
								if (currentCount === count) {
									factor = Math.pow(Math.log(count+2), 3);
									$('#impress').css('transform', 'scale(' + utils.getScale("impress")*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
									// setScaleFactor(factor);
									count = 0;
								}
							}, 500, count);
						}

						previous = current;								
					}
			    }
			}
		});
	}
}
