import Infographic from './infographic.js';
import DesktopInfographic from './desktop-infographic.js';
import MobileInfographic from './mobile-infographic.js';
import controversyAPI from './controversy-api.js';
import utils from './utils.js';

let infographic = new Infographic();
let infographicAsset = "dist/assets/img-desktop/get-big-things-done-1.1.jpg";

document.addEventListener('DOMContentLoaded', () => {
	console.log('document.ready()');

	let html = document.getElementsByTagName('html');
	let preloaderWrapper = document.querySelector('.preloader-wrapper');
	let bigImageContainer = document.querySelector('#impress > div:first-of-type');

	if (infographic.isDesktop) {
		preloaderWrapper.classList.add('active');

		let desktopInfographic = new DesktopInfographic();
		let api = new controversyAPI();

		$.get(api.url + 'cards/' + api.cardId, (data) => {
			api.init(data);

			console.log(api.card);

			var markupPromise = new Promise(
				(resolve, reject) => {
					api.addMetadataMarkup(resolve, reject);
					api.addFootnotesMarkup(resolve, reject);
					api.addSlidesMarkup(resolve, reject);
				}
			);

			markupPromise.then(
				() => {
					desktopInfographic.setupHashChange();
					desktopInfographic.sideNavListItems = 
						document.querySelectorAll('.side-nav > li');
					desktopInfographic.showSideNav();
				}
			);
		});

		// Dynamically add in the img tag, so that this huge file never downloads for mobile
		// Explanation of how to put Impress in a container here ...
		// https://github.com/impress/impress.js/issues/111

		let bigImage = new Image();
		bigImage.onload = function() {
			console.log('infographic loaded.');

			// For flash of content on page load
			bigImageLoaded(this);

			desktopInfographic.initSideNav();

			desktopInfographic.showControls();

			Materialize.toast('Use < / > keys to navigate, + / - to zoom', 10000);

			this.bigImage = document.querySelector('.big-image');
			this.bigImage.style.display = 'block';

			setTimeout(() => {
				this.preloaderWrapper.classList.remove('active');
				this.showElement(this.bigImage, 'fadeIn');

				desktopInfographic.loadImpress();
			}, 4000);			
		}
		bigImage.src = infographicAsset;
		bigImage.alt = "Get Big Things Done Infographic";
		bigImage.className = 'big-image';
		bigImageContainer.append(bigImage);
	} else {
		let mobileInfographic = new MobileInfographic();
		mobileInfographic.init();
	}
});
