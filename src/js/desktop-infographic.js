import Infographic from './infographic.js';
import Keyboard from './keyboard.js';
import kinetic from '../../node_modules/jquery.kinetic/jquery.kinetic.js';
import utils from './utils.js';

export default class DesktopInfographic {
	constructor() {
		// Presentation
		this.impressContainer = document.getElementById('impress');
		this.bigImage = document.querySelector('.big-image');

		// Materialize
		this.$materializeToolTips = $('.tooltipped');
		this.preloaderWrapper = document.querySelector('.preloader-wrapper');

		// SideNav
		this.sideNav = document.getElementById('slide-out');
		this.sideNavListItems = document.querySelectorAll('.side-nav > li');

		this.$hamburgerCollapseIcon = $('.button-collapse');
		this.hamburgerExpandIcon = document.getElementById('hamburger');

		// Icons
		this.startIcon = document.getElementById('start');
		this.endIcon = document.getElementById('end');
		this.mobileViewIcon = document.getElementById('mobile-view');
		this.zoomInIcon = document.getElementById('zoom-in');
		this.zoomOutIcon = document.getElementById('zoom-out');
		this.previousSlideIcon = document.getElementById('previous-slide');
		this.nextSlideIcon = document.getElementById('next-slide');
		this.discussSlideIcon = document.getElementById('discuss-slide');

		this.init();
	}

	init() {
		window.addEventListener('load', () => {
			console.log("window.on(load)");

			this.impressContainer.setAttribute('data-set-scale-factor', 1);

			this.$materializeToolTips.tooltip({delay: 50});

			this.initSideNav();

			this.showControls();

			Materialize.toast('Use < / > keys to navigate, + / - to zoom', 10000);

			this.showSideNav();

			this.bigImage.style.display = 'block';

			setTimeout(() => {
				this.preloaderWrapper.classList.remove('active');
				this.showElement(this.bigImage, 'fadeIn');

				this.loadImpress();
			}, 4000);
		});
	}

	showElement(element, fade) {
		element.classList.add('animated');
		element.classList.add(fade);
		element.style.visibility = 'visible';
	}

	showControls() {
		this.showElement(this.startIcon, 'fadeInUp');
		this.showElement(this.endIcon, 'fadeInUp');
		this.showElement(this.zoomInIcon, 'fadeInRight');
		this.showElement(this.zoomOutIcon, 'fadeInRight');
		this.showElement(this.previousSlideIcon, 'fadeInUp');
		this.showElement(this.nextSlideIcon, 'fadeInUp');
		this.showElement(this.discussSlideIcon, 'fadeInRight');
	}

	showSideNav() {
		this.sideNav.style.display = 'block';
		this.showElement(this.sideNav, 'fadeInLeft');
	}

	initSideNav() {
		// Expand sideNav
		this.$hamburgerCollapseIcon.sideNav({
			menuWidth: 360 // Default is 240
		});

		this.$hamburgerCollapseIcon.sideNav('show');
		this.sideNav.classList.add('active');		
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
		this.setupZooms();
		this.setupDiscuss();
		this.setupNextPrev();
		this.setupKeypresses();
	}

	setupHamburger() {
		// Allow side-nav collapse by pressing the hamburger icon
		this.$hamburgerCollapseIcon.on('click', () => {
			// $("#slide").animate({width:'toggle'},350);
			// $('.button-collapse').sideNav('hide');
			this.sideNav.classList.remove('active');

			this.hamburgerExpandIcon.style.visibility = 'visible';

			console.log("collapse side-nav");
		});

		// Show side-nav bar when corner hamburger is clicked
		this.hamburgerExpandIcon.addEventListener('click', () => {
			this.$hamburgerCollapseIcon.sideNav('show');
			this.sideNav.classList.add('active');
			this.hamburgerExpandIcon.style.visibility = 'hidden';
		});
	}

	setupHashChange() {
		// DECORATING LIST ITEM BORDER FOR CONTENT SLIDES
		// (URL CHANGE --> LI CHANGE)
		// $('#impress > .present').attr('id') can be used to grab the id that is currently
		// activated by impress.js, and with that, we can can apply border styling to
		// the right border of $('.side-nav > li[id="id"');

		window.addEventListener('hashchange', (e) => {
			console.log('slide transition');

			// grab active impress.js slide ID
			let currentSlideHash = document.querySelector('#impress .active').getAttribute('id');

			// Reality-check to console
			console.log("current slide hash: " + currentSlideHash);

			// toggle the active-slide class for the list item with that ID
			this.sideNavListItems.forEach((element) => 
				element.classList.remove('active-slide'));

			let activeSlide = document.querySelector('.side-nav li[data-slide=\"' + currentSlideHash + '\"]');

			if (activeSlide) {
				activeSlide.classList.toggle('active-slide');
			}
		});

		// MOVING INFOGRAPHIC FOCUS BASED UPON CLICKS TO SIDE-NAV
		// (LI CLICK --> URL CHANGE)
		// clicks on $('.side-nav > li') should grab data('slide'), and window.location.hash = 
		// '#your-page-element';

		this.sideNavListItems.forEach((element) => 
			element.addEventListener('click', () => {
				console.log('click-induced transition');

				window.location.hash = '#' + element.getAttribute('data-slide');
			})
		);

		this.startIcon.addEventListener('click', () => {
			window.location.hash = '#intro';
		});

		this.endIcon.addEventListener('click', () => {
			window.location.hash = '#futurism';
		});
	}

	setupZooms() {
		// jQuery automatically adds in necessary vendor prefixes when using
		// .css().  See https://css-tricks.com/how-to-deal-with-vendor-prefixes/.
		this.zoomInIcon.addEventListener('click', () => {
			this.impressContainer.setAttribute('transform', 
				'scale(' + utils.getScale("impress")*1.25 + ')');
		});

		this.zoomOutIcon.addEventListener('click', () => {
			this.impressContainer.setAttribute('transform', 
				'scale(' + utils.getScale("impress")/1.25 + ')');
		});
	}

	setupDiscuss() {
		this.discussSlideIcon.addEventListener('click', () => {

		});
	}

	setupNextPrev() {
		this.previousSlideIcon.addEventListener('click', () => {
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

		this.nextSlideIcon.addEventListener('click', () => {
			impress().next();
		});
	}

	setupKeypresses() {
		let keyboard = new Keyboard(
			this.impressContainer,
			this.sideNav,
			this.$hamburgerCollapseIcon,
			this.hamburgerExpandIcon
		);

		keyboard.init();
	}
}
