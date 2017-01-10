import Infographic from './infographic.js';
import DesktopInfographic from './desktop-infographic.js';
import MobileInfographic from './mobile-infographic.js';
import controversyAPI from './controversy-api.js';
import utils from './utils.js';

let infographic = new Infographic();
let infographicAsset = "dist/assets/img-desktop/get-big-things-done-1.1.jpg";

let pMarkup1, pMarkup2, pMarkup3,
	pSideNav1, pSideNav2, pSideNav3,
	pImpress, pImage;

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

			pMarkup1 = new Promise(
				(resolve, reject) => {
					api.addMetadataMarkup(resolve, reject);
				}
			);

			pMarkup2 = new Promise(
				(resolve, reject) => {
					api.addFootnotesMarkup(resolve, reject);
				}
			);

			pMarkup3 = new Promise(
				(resolve, reject) => {
					api.addSlidesMarkup(resolve, reject);
				}
			);

			// Once slides and footnotes are received from API ...
			Promise.all([pMarkup1, pMarkup2, pMarkup3]).then(
				values => {
					pSideNav1 = new Promise(
						(resolve, reject) => {
							console.log('pSideNav1');
							resolve(desktopInfographic.sideNavListItems = 
								document.querySelectorAll('.side-nav > li'));
						}
					);

					pSideNav2 = new Promise(
						(resolve, reject) => {
							desktopInfographic.initSideNav(resolve, reject);
						}
					);

					// Show SideNav once it's constructed
					Promise.all([pSideNav1, pSideNav2]).then(
						values => {
							pSideNav3 = new Promise(
								(resolve, reject) => {
									desktopInfographic.showSideNav(resolve, reject);
								}
							)
						}
					)
				}
			)
		});

		// Dynamically add in the img tag, so that this huge file never downloads for mobile
		// Explanation of how to put Impress in a container here ...
		// https://github.com/impress/impress.js/issues/111

		let bigImage = new Image();
		bigImage.onload = function() {
			console.log('infographic loaded.');

			// For flash of content on page load
			pImage = new Promise(
				(resolve, reject) => {
					bigImageLoaded(this, resolve, reject);
				}
			);

			pImage.then(
				() => {
					Materialize.toast('Use < / > keys to navigate, + / - to zoom', 10000);

					desktopInfographic.showControls();
					desktopInfographic.bigImage = document.querySelector('.big-image');
					desktopInfographic.bigImage.style.display = 'block';
					desktopInfographic.preloaderWrapper.classList.remove('active');
					desktopInfographic.showElement(this, 'fadeIn');

					pImpress = new Promise(
						(resolve, reject) => {
							desktopInfographic.loadImpress(resolve, reject);
						}
					);

					// Wait to setup the hash change event handler until Impress and large image are loaded
					Promise.all([pImpress, pSideNav3]).then(
						values => {
							console.log('this must happen last')
							desktopInfographic.setupHashChange();
						}
					);
				}
			)

			setTimeout(() => {
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
