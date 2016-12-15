import Infographic from './infographic.js';
import DesktopInfographic from './desktop-infographic.js';
import MobileInfographic from './mobile-infographic.js';
import utils from './utils.js';

let infographic = new Infographic();

$(window).on('load', function() {
	// Check if user has set a preferred device
	if (infographic.deviceCookie === 'mobile') {
		$('html').removeClass('desktop').removeClass('tablet').addClass('mobile');
	}

	let desktopInfographic = new DesktopInfographic();

	if (infographic.isDesktop && infographic.deviceCookie !== 'mobile') {
		$('.preloader-wrapper').addClass('active');

		// Dynamically add in the img tag, so that this huge file never downloads for mobile
		// Explanation of how to put Impress in a container here ...
		// https://github.com/impress/impress.js/issues/111
		let firstDiv = document.querySelector('#impress > div:first-of-type');

		let largeImage = new Image();
		largeImage.onload = function () {
			console.log('infographic loaded.');

			// For flash of content on page load
			bigImageLoaded(this);

			desktopInfographic.init();
		}
		largeImage.src = "dist/assets/img-desktop/get-big-things-done-1.1.jpg";
		largeImage.alt = "Get Big Things Done Infographic";
		largeImage.className = 'big-image';
		firstDiv.appendChild(largeImage);
	} else {
		// mobile stuff
	}
});

$(document).ready(function() {
	if (infographic.isDesktop && infographic.deviceCookie != 'mobile') {
		console.log("desktop or tablet document.ready()");
	} else {
		let mobileInfographic = new MobileInfographic();
		mobileInfographic.init();
	}
});
