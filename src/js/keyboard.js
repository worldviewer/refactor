import utils from './utils.js';

// Note that impress maps both the right/left arrows and page down/up for slide next/previous
export default class Keyboard {
	constructor(impressContainer, sideNav, hamburgerCollapseIcon, hamburgerExpandIcon) {
		this.impressContainer = impressContainer;
		this.sideNav = sideNav;
		this.hamburgerCollapseIcon = hamburgerCollapseIcon;
		this.hamburgerExpandIcon = hamburgerExpandIcon;

		this.tabKey = 9; // toggle sideNav
		this.plusKey = 187; // zoom in
		this.minusKey = 189; // zoom out
		this.keypressCount = 0; // counts successive + or -
	}

	init() {
		this.setupSideNavToggle();
		this.setupZoomOutKey();
		this.setupZoomInKey();

		$(document).keydown( (e) => {
			if ((e.keyCode === this.tabKey) || 
				(e.keyCode === this.minusKey) || 
				(e.keyCode === this.plusKey)) {

			    console.log("key code: " + e.keyCode);
                e.preventDefault();
            }			
		});
	}

	setupSideNavToggle() {
		$(document).keydown( (e) => {
			if (e.keyCode === this.tabKey) {
		    	if (this.sideNav.hasClass('active')) {
					this.hamburgerCollapseIcon.trigger('click');
				} else {
					this.hamburgerExpandIcon.trigger('click');
				}
			}
		});
	}

	// This zoom equation was derived through trial and error
	calculateZoom(keypressCount) {
		return Math.pow(Math.log(keypressCount + 2), 3);
	}

	// Calculates new scale based upon previous
	calculateScale(element, direction, factor) {
		console.log('factor: ' + factor);

		return direction === 'in' ? 
			utils.getScale(element.attr('id')) * factor :
			utils.getScale(element.attr('id')) / factor;
	}

	// Zooms via CSS transform
	cssZoom(element, direction, factor) {
		let newScale = this.calculateScale(element, direction, factor);
		console.log('New scale: ' + newScale);

		element.css('transform', 'scale(' + newScale +
			')').css('transition-duration', '0.25s').css('transition-delay', '0');
	}

	getTimeDiff(currentTime, previousTime) {
		return parseInt(currentTime) - parseInt(previousTime);
	}

	// Allows user to zoom in rapidly with consecutive keypresses
	bigCssZoom(element, direction) {
		let factor = this.calculateZoom(this.keypressCount);

		setTimeout( (currentCount) => {
			// waits a half sec, then does nothing if another key event has been created,
			// incrementing keypressCount past the currentCount for this former event
			if (currentCount === this.keypressCount) {
				console.log('key presses: ' + this.keypressCount);
				this.cssZoom(element, direction, factor);
				this.keypressCount = 0; // reset for next sequence
			}
		}, 500, this.keypressCount);

		this.previousTime = this.currentTime; // reset our clock for next keypress
	}

	// Evaluates total zoom based upon the number of consecutive zoom keypresses
	evaluateZoomScale(element, direction) {
    	this.currentTime = Date.now();
		let timeDiff = this.getTimeDiff(this.currentTime, this.previousTime);

		// First keypress in a series
		if (this.keypressCount === 0) {
			this.keypressCount++;

			this.bigCssZoom(element, direction);

		// This keypress occurred within a quarter second of the last
		} else {
			if (this.getTimeDiff(this.currentTime, this.previousTime) < 250) {
				this.keypressCount++;

				this.bigCssZoom(element, direction);
			}				
		}
	}

	setupZoomInKey() {
		this.previousTime = Date.now();

		$(document).keydown( (e) => {
			if (e.keyCode === this.plusKey) {
				this.evaluateZoomScale(this.impressContainer, 'in');
			}
		});
	}

	setupZoomOutKey() {
		this.previousTime = Date.now();

		$(document).keydown( (e) => {
			if (e.keyCode === this.minusKey) {
				this.evaluateZoomScale(this.impressContainer, 'out');
			}
		});
	}
}
