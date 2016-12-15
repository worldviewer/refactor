import Infographic from './infographic.js';
import DesktopInfographic from './desktop-infographic.js';
import MobileInfographic from './mobile-infographic.js';
import utils from './utils.js';

let infographic = new Infographic();
let desktopInfographic = new DesktopInfographic();

$(window).on('load', function() {
	// Check if user has set a preferred device
	if (infographic.deviceCookie === 'mobile') {
		$('html').removeClass('desktop').removeClass('tablet').addClass('mobile');
	}

	if (infographic.isDesktop && infographic.deviceCookie !== 'mobile') {
		$('.preloader-wrapper').addClass('active');

		// Dynamically add in the img tag, so that this huge file never downloads for mobile
		// Explanation of how to put Impress in a container here ...
		// https://github.com/impress/impress.js/issues/111
		let firstDiv = document.querySelector('#impress > div:first-of-type');

		let largeImage = new Image();
		largeImage.onload = function () {
			bigImageLoaded(this);

			console.log('infographic loaded.');

			// Initialize the presentation scale to 1
			$('#impress').attr('data-set-scale-factor', 1);

			$('.tooltipped').tooltip({delay: 50});

			$('.button-collapse').sideNav({
				menuWidth: 360 // Default is 240
			});

			// Always start infographic with active side-nav bar
			$('.button-collapse').sideNav('show');
			$('#slide-out').addClass('active');

			$('#page-up').addClass('animated fadeInUp').css('visibility', 'visible');
			$('#page-down').addClass('animated fadeInUp').css('visibility', 'visible');
			$('#mobile-view').addClass('animated fadeInRight').css('visibility', 'visible');
			$('#zoom-in').addClass('animated fadeInRight').css('visibility', 'visible');
			$('#zoom-out').addClass('animated fadeInRight').css('visibility', 'visible');
			$('#previous-slide').addClass('animated fadeInUp').css('visibility', 'visible')
			$('#next-slide').addClass('animated fadeInUp').css('visibility', 'visible');
			$('#discuss-slide').addClass('animated fadeInRight').css('visibility', 'visible');
			Materialize.toast('Use < and > keys to navigate', 10000);

			$('#slide-out').show();
			$('#slide-out').addClass('animated fadeInLeft').css('visibility', 'visible');

			$('.big-image').show();

			setTimeout(() => {
				$('.preloader-wrapper').removeClass('active');
				$('.big-image').addClass('animated fadeIn').css('visibility', 'visible');

				desktopInfographic.init();
			}, 5000);
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
