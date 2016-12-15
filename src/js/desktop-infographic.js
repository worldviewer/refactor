import Infographic from './infographic.js';
import kinetic from '../../node_modules/jquery.kinetic/jquery.kinetic.js';
import utils from './utils.js';

export default class DesktopInfographic {
	constructor() {
		console.log('desktop or tablet window.load()');

		// Presentation
		this.impressContainer = $('#impress');
		this.bigImage = $('.big-image');

		// Materialize
		this.materializeToolTips = $('.tooltipped');
		this.preloaderWrapper = $('.preloader-wrapper');

		// SideNav
		this.sideNav = $('#slide-out');
		this.sideNavListItems = $('.side-nav > li');

		this.hamburgerCollapseIcon = $('.button-collapse');
		this.hamburgerExpandIcon = $('#hamburger');

		// Icons
		this.pageUpIcon = $('#page-up');
		this.pageDownIcon = $('#page-down');
		this.mobileViewIcon = $('#mobile-view');
		this.zoomInIcon = $('#zoom-in');
		this.zoomOutIcon = $('#zoom-out');
		this.previousSlideIcon = $('#previous-slide');
		this.nextSlideIcon = $('#next-slide');
		this.discussSlideIcon = $('#discuss-slide');

		this.init();
	}

	init() {
		$(window).on('load', () => {
			console.log("desktop or tablet document.ready()");

			// Initialize impress.js presentation scale to 1
			this.impressContainer.attr('data-set-scale-factor', 1);

			// Initialize Materialize tooltip
			this.materializeToolTips.tooltip({delay: 50});

			// Initialize Materialize sideNav
			this.hamburgerCollapseIcon.sideNav({
				menuWidth: 360 // Default is 240
			});

			this.hamburgerCollapseIcon.sideNav('show');
			this.sideNav.addClass('active');

			this.showControls();

			Materialize.toast('Use < and > keys to navigate', 10000);

			this.showSideNav();

			this.bigImage.show();

			setTimeout(() => {
				this.preloaderWrapper.removeClass('active');
				this.bigImage.addClass('animated fadeIn').css('visibility', 'visible');

				this.loadImpress();
			}, 4000);
		});
	}

	showControls() {
		this.pageUpIcon.addClass('animated fadeInUp').css('visibility', 'visible');
		this.pageDownIcon.addClass('animated fadeInUp').css('visibility', 'visible');
		this.mobileViewIcon.addClass('animated fadeInRight').css('visibility', 'visible');
		this.zoomInIcon.addClass('animated fadeInRight').css('visibility', 'visible');
		this.zoomOutIcon.addClass('animated fadeInRight').css('visibility', 'visible');
		this.previousSlideIcon.addClass('animated fadeInUp').css('visibility', 'visible')
		this.nextSlideIcon.addClass('animated fadeInUp').css('visibility', 'visible');
		this.discussSlideIcon.addClass('animated fadeInRight').css('visibility', 'visible');
	}

	showSideNav() {
		this.sideNav.show();
		this.sideNav.addClass('animated fadeInLeft').css('visibility', 'visible');
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
		this.hamburgerCollapseIcon.on('click', () => {
			// $("#slide").animate({width:'toggle'},350);
			// $('.button-collapse').sideNav('hide');
			this.sideNav.removeClass('active');

			this.hamburgerExpandIcon.css('visibility', 'visible');

			console.log("collapse side-nav");
		});

		// Show side-nav bar when corner hamburger is clicked
		this.hamburgerExpandIcon.on('click', () => {
			this.hamburgerCollapseIcon.sideNav('show');
			this.sideNav.addClass('active');
			this.hamburgerExpandIcon.css('visibility', 'hidden');
		});
	}

	setupHashChange() {
		// DECORATING LIST ITEM BORDER FOR CONTENT SLIDES
		// (URL CHANGE --> LI CHANGE)
		// $('#impress > .present').attr('id') can be used to grab the id that is currently
		// activated by impress.js, and with that, we can can apply border styling to
		// the right border of $('.side-nav > li[id="id"');

		$(window).on('hashchange', (e) => {
			console.log('slide transition');

			// grab active impress.js slide ID
			var currentSlideHash = $('#impress .active').attr('id');

			// Reality-check to console
			console.log("current slide hash: " + currentSlideHash);

			// toggle the active-slide class for the list item with that ID
			this.sideNavListItems.removeClass('active-slide');
			$('.side-nav li[data-slide=\"' + currentSlideHash + '\"]').toggleClass('active-slide');
		});

		// MOVING INFOGRAPHIC FOCUS BASED UPON CLICKS TO SIDE-NAV
		// (LI CLICK --> URL CHANGE)
		// clicks on $('.side-nav > li') should grab data('slide'), and window.location.hash = 
		// '#your-page-element';

		this.sideNavListItems.on('click', () => {
			console.log('click-induced transition');
			window.location.hash = '#' + $(this).data('slide');
		});

		this.pageUpIcon.on('click', () => {
			window.location.hash = '#intro';
		});

		this.pageDownIcon.on('click', () => {
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

		this.mobileViewIcon.on('click', () => {
			Cookies.set('display', 'mobile', {expires: 365});

			console.log("display: " + Cookies.get('display'));

			// Then reload the page ...
			document.location.reload();
		});
	}

	setupZooms() {
		// jQuery automatically adds in necessary vendor prefixes when using
		// .css().  See https://css-tricks.com/how-to-deal-with-vendor-prefixes/.
		this.zoomInIcon.on('click', () => {
			this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")*1.25 + ')');
		});

		this.zoomOutIcon.on('click', () => {
			this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")/1.25 + ')');
		});
	}

	setupDiscuss() {
		this.discussSlideIcon.on('click', () => {

		});
	}

	setupNextPrev() {
		this.previousSlideIcon.on('click', () => {
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

		this.nextSlideIcon.on('click', () => {
			impress().next();
		});
	}

	setupKeypresses() {
		var count = 0;
		var current, start, end, previous, diff, factor;

		// Define shortcuts here
		// REFACTOR THIS
		$(document).keydown( (e) => {
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
		    	if (this.sideNav.hasClass('active')) {
					this.hamburgerCollapseIcon.trigger('click');
				} else {
					this.hamburgerExpandIcon.trigger('click');
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

						setTimeout( (currentCount) => {
							console.log('count: ' + count + ", currentCount: " + currentCount);
							if (currentCount === count) {
								factor = Math.pow(Math.log(count+2), 3);
								this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
							setTimeout( (currentCount) => {
								console.log('count: ' + count + ", currentCount: " + currentCount);
								if (currentCount === count) {
									factor = Math.pow(Math.log(count+2), 3);
									this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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

						setTimeout( (currentCount) => {
							console.log('count: ' + count + ", currentCount: " + currentCount);
							if (currentCount === count) {
								factor = Math.pow(Math.log(count+2), 3);
								this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
							setTimeout( (currentCount) => {
								console.log('count: ' + count + ", currentCount: " + currentCount);
								if (currentCount === count) {
									factor = Math.pow(Math.log(count+2), 3);
									this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
