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

	if (infographic.isDesktop && infographic.deviceCookie !== 'mobile') {
		// desktop stuff
	} else {
		// mobile stuff
	}
});

$(document).ready(function() {
	if (infographic.isDesktop && infographic.deviceCookie != 'mobile') {
		console.log("desktop or tablet document.ready()");

		let desktopInfographic = new DesktopInfographic();
		desktopInfographic.init();
	} else {
		let mobileInfographic = new MobileInfographic();
		mobileInfographic.init();
	}
});
