$(window).load(function() {

	console.log("cookie: " + Cookies.get('display'));
	if (Cookies.get('display') === 'mobile') {
		$('html').removeClass('desktop').removeClass('tablet').addClass('mobile');
	}

	if (!device.mobile() && !device.tablet() && (Cookies.get('display') !== 'mobile')) {
		$('#page-up').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#page-down').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#mobile-view').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#zoom-in').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#zoom-out').addClass('animated fadeInRight').css('visibility', 'visible');
		$('#previous-slide').addClass('animated fadeInUp').css('visibility', 'visible')
		$('#next-slide').addClass('animated fadeInUp').css('visibility', 'visible');
		$('#discuss-slide').addClass('animated fadeInRight').css('visibility', 'visible');

		setTimeout(function() {
			$('#slide-out').addClass('animated fadeInLeft').css('visibility', 'visible');
		}, 1000);

		setTimeout(function() {
			$('.big-image').addClass('animated fadeIn').css('visibility', 'visible');
			$('.preloader-wrapper').removeClass('active');
		}, 3000);

		Materialize.toast('Use < and > arrow keys to navigate', 9000);

		setTimeout(function() {
			Materialize.toast('Change views with the mobile icon, top-right', 10000);
		}, 10000);

		// Add in drag scroll once all animations have completed.  For some reason,
		// I'm not able to get the deceleration to work for this, even when I modify
		// the slowdown value in the original code ...
		$(window).kinetic();

	// When mobile, do this instead ...
	} else {
		console.log("mobile window.load()");

		// Set the height of #mobile to the window height.  This is necessary in order
		// to ensure a consistent scrollTop value
		$('#mobile').css('height', window.innerHeight);
		$(window).resize(function() {
			$('#mobile').css('height', window.innerHeight);
		});

		// var myScroll;
		// setTimeout(function() {
		// 	myScroll = new IScroll('#iscroll',
		// 		{deceleration: 0.000001});
		// }, 200);

		// Get a handle on the jQuery object
		var pageHash = $('.page-hash').find('p');
		var hash = '';

		// The new URL is only posted after scrolling has stopped for a full second
		var scrollTrigger = debounce(function (newHash) {
			if($('#mobile').hasClass('expanded')) {
				hash = newHash;
				console.log("id in scrollTrigger: " + newHash);

				// Set the active slide, just in case user switches to table of contents;
				// We then want it to be painted red
				currentSlide = '#' + newHash;

				// First, slide old page-hash out for half-second, debounced on the
				// leading edge (with 3rd debounce parameter, 'true')
				pageHash.addClass('animated bounceOutLeft');

				// This code snippet surprisingly works, and it comes from
				// http://www.gmarwaha.com/blog/2009/06/09/jquery-waiting-for-multiple-animations-to-complete/
				var wait1 = setInterval(function() {
					if( !$(".page-hash").is(":animated") ) {
						clearInterval(wait1);

						pageHash.removeClass('animated bounceOutLeft');

						// Slide the new message in
						pageHash.html('<a><b>#' + newHash + '</b></a>').addClass('animated bounceInLeft');

						var wait2 = setInterval(function() {
							if( !$(".page-hash").is(":animated") ) {
								clearInterval(wait2);

								pageHash.removeClass('animated bounceInLeft');
								window.location.hash = newHash;
							}
						}, 200);
					}
				}, 200);

			}
		}, 1000);

		// This function posts to the page-hash display during scroll a reminder
		// to click to copy
		var scrollMessage = debounce(function(message) {
			// First, slide old page-hash out for half-second, debounced on the
			// leading edge (with 3rd debounce parameter, 'true')

			var expanded = $('#mobile').hasClass('expanded');
			if (!startState && expanded) {
				pageHash.addClass('animated bounceOutLeft');

				var wait1 = setInterval(function() {
					if( !$(".page-hash").is(":animated") ) {
						clearInterval(wait1);

						pageHash.removeClass('animated bounceOutLeft');

						// Slide the new message in
						pageHash.html(message).addClass('animated bounceInLeft');
						var wait2 = setInterval(function() {
							if( !$(".page-hash").is(":animated") ) {
								clearInterval(wait2);

								pageHash.removeClass('animated bounceInLeft');
							}
						}, 200);

					}
				}, 200);

			} else if (expanded) {
				pageHash.html('Click to copy this URL');
				startState = false;
			}
		}, 1000, true);

		// This comes from Underscore.js ...
		// Returns a function, that, as long as it continues to be invoked, 
		// will not be triggered. The function will be called after it stops 
		// being called for N milliseconds. If `immediate` is passed, trigger the 
		// function on the leading edge, instead of the trailing.
		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};					

		function scrollBetween(scrollObject, min, max) {
			var maximum = max || scrollObject[0].scrollHeight;
			var x = scrollObject.scrollTop;
			return x >= min && x <= maximum;
		}

		// This implements the sticky navbar
		var wrap = $("#mobile");

		wrap.on("scroll", function(e) {
			// console.log("scrollTop: " + this.scrollTop);

			scrollMessage('Click to copy this URL');

			if (scrollBetween(this, 0, 109)) {
				wrap.removeClass("fix-hash");
				wrap.addClass("detach-hash");
			} else {
				wrap.addClass("fix-hash");
				wrap.removeClass("detach-hash");
			}
		});

		// Cut up slides based upon vertical scroll distances
		var newSlides = function () {
			// initialize the ScrollMagic controller
			var controller = new ScrollMagic.Controller();

			var slides = [];
			var duration;

			// Select all cards
			// On the first pass, we want all undefined cards to add their heights into
			// the defined cards which precede them
			$('.card').each(function(i) {
				// Calculate card heights as height plus some margin
				duration = $(this).height() + 22;

				// console.log("i: " + i + ", height: " + duration + ", id: " + $(this).attr('id'));

				// Does it have an id attribute?
				if($(this).attr('id')) {
					slides.push( {'height': duration, 'hash': $(this).attr('id')} );

				// If not, then add its height to the last pushed array element
				} else if (slides.length == 0) {
					// Do nothing, because there are no slides yet
				} else {
					slides[slides.length-1]['height'] += duration;
				}
			});

			// console.log("pre-scenes");
			// console.log(slides);

			// Select just the cards with id's
			cards = $('.card[id]');

			// On the second pass, we want to create the scenes and record the vertical positions
			slides.forEach(function(slide) {

				// Grab the id for each that has one
				var id = slide['hash'];
				var height = slide['height'];

				var scrollYPos = $("#mobile #" + id).offset().top - 72;
				slide['ypos'] = scrollYPos;

				console.log("id: " + id + ", ypos: " + scrollYPos + ", height: " + height);

				// console.log("duration: " + height + ", id: " + id);

				// The 0.5 triggerHook sets the page-hash to whatever is in the middle of
				// the screen.  I think this is more intuitive than the "onLeave" option (1)
				slide['scene'] = new ScrollMagic.Scene(
					   {triggerElement: "#mobile #" + id, 
						offset: -72,
						duration: height,
						triggerHook: 0.5})
						.addTo(controller)
						.on("progress", function (e) {
							if (e.state == "DURING") {
								console.log('id at event: ' + id);
						        scrollTrigger(id);

								// This created a mysterious closure problem
								// $('#mobile').scroll(function() {
								//     clearTimeout($.data(this, 'scrollTimer'));
								//     $.data(this, 'scrollTimer', setTimeout(function() {
								    	
								// 	    }
								//     }, 2000));
								// });
							}
						})
			});

			// console.log('last slide: ' + slides[slides.length-1]['hash']);

			// Make the last slide accessible; this will affect the accessibility of the next-to-last
			// as a consequence
			slides[slides.length-1]['scene'] = new ScrollMagic.Scene(
				   {triggerElement: "#mobile #" + slides[slides.length-1]['hash'], triggerHook: "onEnter"})
					.addTo(controller)
					.on("enter", function (e) {
						scrollTrigger(slides[slides.length-1]['hash']);
						console.log('end!');
					});

			// console.log("post-scenes");
			console.log(slides);

			return {'controller': controller, 'slides': slides};
		}

		var scrollObject = newSlides();

		function scrollToHash(hash) {
			var scrollYPos = 0;

			// Make sure incoming hash is in the correct format
			hash = hash.replace(/\//, '');
			hash = hash.replace(/^#/, '');

			// Check that the hash exists
			var exists = false;
			for (var i=0; i<scrollObject.slides.length; i++) {
				if (hash === scrollObject.slides[i]['hash']) {
					exists = true;
				}
			}

			if (exists) {
				scrollYPos = $('#mobile').scrollTop() + 
					$('#mobile #' + hash).offset().top - window.innerHeight/2 + 30;
			} 

			console.log("hash: " + hash + ", scrollYPos: " + scrollYPos);
			$("#mobile").scrollTo(scrollYPos, 800);
		}

		function slideToggle () {
			$('#mobile').find(currentSlide).toggleClass('current-card');
			console.log("currentSlide: " + currentSlide);

			$('#mobile').toggleClass('collapsed');
			$('#mobile').toggleClass('expanded');

			$('.content .card-images:not(:first)').slideToggle().promise().done(function(e) {
				// This awesome snippet of code was inspired by this page ...
				// http://stackoverflow.com/questions/27632300/jquery-offset-returns-negative-value
				// I'm not sure why 30 makes this centered, btw ...

				// This is where I scroll for collapsed state
				if ($('#mobile').hasClass('collapsed')) {
					scrollToHash(currentSlide);
				}
		    });
		}

		// Code comes from http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
		function copyTextToClipboard(text) {
			var textArea = document.createElement("textarea");

			//
			// *** This styling is an extra step which is likely not required. ***
			//
			// Why is it here? To ensure:
			// 1. the element is able to have focus and selection.
			// 2. if element was to flash render it has minimal visual impact.
			// 3. less flakyness with selection and copying which **might** occur if
			//    the textarea element is not visible.
			//
			// The likelihood is the element won't even render, not even a flash,
			// so some of these are just precautions. However in IE the element
			// is visible whilst the popup box asking the user for permission for
			// the web page to copy to the clipboard.
			//

			// Place in top-left corner of screen regardless of scroll position.
			textArea.style.position = 'fixed';
			textArea.style.top = 0;
			textArea.style.left = 0;

			// Ensure it has a small width and height. Setting to 1px / 1em
			// doesn't work as this gives a negative w/h on some browsers.
			textArea.style.width = '2em';
			textArea.style.height = '2em';

			// We don't need padding, reducing the size if it does flash render.
			textArea.style.padding = 0;

			// Clean up any borders.
			textArea.style.border = 'none';
			textArea.style.outline = 'none';
			textArea.style.boxShadow = 'none';

			// Avoid flash of white box if rendered for any reason.
			textArea.style.background = 'transparent';

			textArea.value = text;

			document.body.appendChild(textArea);

			textArea.select();

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				scrollMessage('Copy was ' + msg);
			} catch (err) {
				scrollMessage('Copy unsupported');
			}

			document.body.removeChild(textArea);
		}

		// var copyBobBtn = document.querySelector('.js-copy-bob-btn'),
		// 	copyJaneBtn = document.querySelector('.js-copy-jane-btn');

		// copyBobBtn.addEventListener('click', function(event) {
		// 	copyTextToClipboard('Bob');
		// });

		// copyJaneBtn.addEventListener('click', function(event) {
		// 	copyTextToClipboard('Jane');
		// });

		// Copy should set og:title, og:url, og:description, og:image
		$('.top-header, .page-hash').on('click', function() {
			// var metaTitle = document.querySelector('meta[property$="title"]');
			// var metaURL = document.querySelector('meta[property$="url"]');
			// var metaDescription = document.querySelector('meta[property$="description"]');
			// var metaImage = document.querySelector('meta[property$="image"]');

			copyTextToClipboard("https://worldviewer.github.io" + currentSlide);
		});

		// $('.content .card-images:not(:first)').slideToggle();

		// This click handler toggles between collapsed and expanded states for slides
		$('.menu-icon').on('click', function() {
			console.log('toggle collapse state for mobile cards');

			// When in Table of Contents mode, do not display cards with scroll
			if ($('#mobile').hasClass('expanded')) {
				$('.page-hash').find('p').html('Click card to jump to it');
				scrollObject.controller.enabled(false);

			} else {
				scrollObject.controller.enabled(true);
			}

			slideToggle();

			// Make sure that the recalculation does not occur until the collapse state
			// is fully toggled
			// var callbacks = $.Callbacks();
			// callbacks.add(slideToggle);
			// callbacks.add(recalculateSlides);
			// callbacks.fire();

			// console.log(slides);
		});

		$('.card').on('click', function(e) {
			if ($('#mobile').hasClass('collapsed')) {
				e.stopPropagation();

				slideToggle();
				scrollObject.controller.enabled(true);

				var hash = $(this).attr('id') || $(this).data('id');
				console.log('hash: ' + hash);
				window.location.hash = hash;

				// Wait for screen to re-draw before scrolling.  This is where I scroll for
				// expanded state.
				setTimeout(function() {
					var scrollYPos = 0;
					for (var i=0; i<scrollObject.slides.length; i++) {
						if (scrollObject.slides[i]['hash'] === hash) {
							scrollYPos = scrollObject.slides[i]['ypos'];
						}
					}

					// var scrollYPos = $("#mobile #" + hash).offset().top - 72;
					console.log("scrollYPos: " + scrollYPos);

					$("#mobile").scrollTo(scrollYPos, 800);
				}, 900);
			}
		})

		// To save screen real estate, we want to cycle between all of the social share icons
		// once every 5 seconds.  SVG's are .twitter, .gplus, .fb
		var initializeShareIcons = (function() {
			var logos = ['.twitter', '.gplus', '.fb'];

			// All social share icons are initially hidden, via CSS
			// $('.top-header svg').css('visibility', 'hidden');

			// We will use this to cycle through the logos array
			var currentLogo = 0;
			var lastLogo = 2;
			var $currentLogo, $lastLogo;

			var switchShareIcon = setInterval(function() {
				// Access the DOM once
				$currentLogo = $(logos[currentLogo]);
				$lastLogo = $(logos[lastLogo]);

				// console.log('currentLogo: ' + currentLogo);
				// console.log($currentLogo);
				// console.log('lastLogo: ' + lastLogo);
				// console.log($lastLogo);

				// First, animate out the former logo
				$lastLogo.addClass('animated zoomOut');

				// This code snippet comes from
				// http://www.gmarwaha.com/blog/2009/06/09/jquery-waiting-for-multiple-animations-to-complete/
				var wait1 = setInterval(function() {
					if( !$lastLogo.is(":animated") ) {
						clearInterval(wait1);

						// Reset the animation and hide the element
						$lastLogo.removeClass('animated zoomOut active');

						// Animate in the new share icon
						$currentLogo.addClass('animated zoomIn active');

						var wait2 = setInterval(function() {
							if( !$currentLogo.is(":animated") ) {
								clearInterval(wait2);

								$currentLogo.removeClass('animated zoomIn');
							}
						}, 200);
					}
				}, 200);

				currentLogo = (currentLogo + 1) % 3;
				lastLogo = (lastLogo + 1) % 3;
			}, 7000);

		})();

		// HTML must be marked up as follows in order for G+ to provide options for images
		// <body itemscope itemtype="http://schema.org/Product">
		// 		<h1 itemprop="name">Shiny Trinket</h1>
		// 		<img itemprop="image" src="image-url"></img>
		// 		<p itemprop="description">Shiny trinkets are shiny.</p>
		// </body>				

		// Note that these annotations are only valid in the current itemscope. The +1 button has to 
		// be placed inside this scope as well, since it looks for the first itemscope that occur 
		// above the button in the DOM hierarchy.

		// The positive side of that is that you can define multiple itemscopes per page, thus easily 
		// integrate multiple +1 buttons with different share snippets on it.

		$('a.gplus').on('click', function(e) {
			e.stopPropagation();
			console.log("https://plus.google.com/share?url=" + "http://worldviewer.github.io");
			window.open("https://plus.google.com/share?url=" + "http://worldviewer.github.io", '', 
				'menubar=no,toolbar=no,resizable=yes,scrollbars=yes');
			return false;
		});

		$('a.twitter').on('click', function(e) {
			e.stopPropagation();
			!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
		});

		// This comes from http://stackoverflow.com/questions/16463030/how-to-add-facebook-share-button-on-my-website
		$('div.fb').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();

			FB.ui({
				method: 'feed',
				name: 'Is It Possible to Increase the Rate of Innovation?',
				link: 'https://www.worldviewer.github.io',
				picture: 'https://worldviewer.github.io/src/img-mobile/get-big-things-done-7.jpg',
				caption: 'worldviewer.github.io',

				// 297 max
				description: "We have an unfortunate tradition of treating our best scientific critics as cranks or pseudoscientists. Yet there are potential answers to the biggest questions in science which are precluded by this incremental approach. Let me show you some examples of promising challenges to textbook theory.",
				message: ""
			});
		});

		// bind scroll to anchor links
		// check history situation with this code
		// $(document).on("click", "a[href^='#']", function (e) {
		// 	var id = $(this).attr("href");
		// 	if ($(id).length > 0) {
		// 		e.preventDefault();

		// 		// trigger scroll
		// 		controller.scrollTo(id);

		// 		// if supported by the browser we can even update the URL.
		// 		if (window.history && window.history.pushState) {
		// 			history.pushState("", document.title, id);
		// 		}
		// 	}
		// });	

		// Grab anchor to scroll to from URL hash
		var URLhash = window.location.hash;

		// If a URL hash exists, then we want to store state information to avoid
		// scrolling the 'click to copy' message off the screen during scroll
		var startState = URLhash ? true : false;

		// Remove the forward-slash that is sometimes added into the URL
		URLhash = URLhash.replace(/\//, '');
		console.log("window.location.hash: " + URLhash);

		// Keep track of the current slide, so that we can paint it red in the
		// table of contents
		currentSlide = URLhash;

		// Calculate pixel position of anchor
		var scrollYPos = $("#mobile " + URLhash).offset().top - 72;
		console.log("scrollYPos: " + scrollYPos);

		// None of these three approaches worked ...
		// controller.scrollTo(URLhash);
		// controller.scrollTo(scrollYPos);
		// TweenLite.to(window, 2, {scrollTo:{y:scrollYPos, x:0}, ease:Power4.easeOut})

		// But this did ...
		$("#mobile").scrollTo(scrollYPos, 800);

		setTimeout(function() {
			Materialize.toast('Click top-right for table of contents', 10000);
		}, 3000);
	}
});

// Useful info on integrating Google Analytics using Google's Tag Manager to track by CSS Selector ...
// http://www.simoahava.com/analytics/matches-css-selector-operator-in-gtm-triggers/
// This would be the best way to observe the page interactions

// Explanation of how to put Impress in a container here ...
// https://github.com/impress/impress.js/issues/111

// Explanation of how to invoke a JS file from within a JS script at ...
// http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file

function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

// This function returns the current scale of the element marked with
// the #impress ID.  Comes from site here ...
// https://css-tricks.com/get-value-of-css-rotation-through-javascript/
function getScale() {
	var el = document.getElementById("impress");
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
	         st.getPropertyValue("-moz-transform") ||
	         st.getPropertyValue("-ms-transform") ||
	         st.getPropertyValue("-o-transform") ||
	         st.getPropertyValue("transform") ||
	         "fail...";

	// With rotate(30deg)...
	// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
	console.log('Matrix: ' + tr);

	// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	var values = tr.split('(')[1];
	    values = values.split(')')[0];
	    values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	console.log("scale: " + Math.sqrt(a*a + b*b));

	return(Math.sqrt(a*a + b*b));
}

function setScaleFactor(factor) {
	$('#impress').attr('data-scale-factor', factor);
	console.log("set scale factor: " + factor);
}

var myPrettyCode = function() {
	impress().init();

	// When not mobile, do this ...

	$(document).ready(function() {
		console.log("desktop or tablet document.ready()");

		// Materialize.css does not currently work well with iPad touches, so for now,
		// I'm going to bump tablet users to the simpler mobile interface ...
		// 
		// var ua = navigator.userAgent,
		// event = (device.ipad()) ? "touchstart" : "click";
		// $("theElement").bind(event, function(e) {
		// }
		//
		// Explanations of the problem here ...
		// http://www.danwellman.co.uk/fixing-jquery-click-events-for-the-ipad/
		// https://github.com/Dogfalo/materialize/issues/2319

		// Initialize the presentation scale to 1
		$('#impress').attr('data-set-scale-factor', 1);

		$('.tooltipped').tooltip({delay: 50});

		$('.button-collapse').sideNav({
			menuWidth: 360 // Default is 240
		});

		// Always start infographic with active side-nav bar
		$('.button-collapse').sideNav('show');
		$('#slide-out').addClass('active');

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

		// jQuery automatically adds in necessary vendor prefixes when using
		// .css().  See https://css-tricks.com/how-to-deal-with-vendor-prefixes/.
		$('#zoom-in').on('click', function() {
			$('#impress').css('transform', 'scale(' + getScale()*1.25 + ')');
		});

		$('#zoom-out').on('click', function() {
			$('#impress').css('transform', 'scale(' + getScale()/1.25 + ')');
		});

		$('#discuss-slide').on('click', function() {

		});

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
								$('#impress').css('transform', 'scale(' + getScale()/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
									$('#impress').css('transform', 'scale(' + getScale()/factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
								$('#impress').css('transform', 'scale(' + getScale()*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
									$('#impress').css('transform', 'scale(' + getScale()*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
	});
};

if (Cookies.get('display') === 'mobile') {
	$('html').removeClass('desktop').removeClass('tablet').addClass('mobile');
}

if (!device.mobile() && !device.tablet() && (Cookies.get('display') !== 'mobile')) {
	$('.preloader-wrapper').addClass('active');

	// Dynamically add in the img tag, so that this huge file never downloads for mobile

	var firstDiv = document.querySelector('#impress > div:first-of-type');
	firstDiv.insertAdjacentHTML('beforeend', '<img class="big-image" src="src/img-desktop/get-big-things-done-1.1.jpg" alt="Get Big Things Done Infographic">');

	loadScript("src/lib/impress.js", myPrettyCode);
} else {
	// When mobile, do this instead ...
	console.log("should only run on mobile");

	$(document).ready(function() {

	});
}