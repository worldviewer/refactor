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

	// Allows user to zoom in rapidly with consecutive keypresses
	bigCssZoom(element, direction, keypressCount) {
		let factor;
		setTimeout( (currentCount) => {
			if (currentCount === keypressCount) {
				factor = this.calculateZoom();
				this.cssZoom(element, direction, factor);
				keypressCount = 0;
			}
		}, 500, keypressCount);		
	}

	getTimeDiff(currentTime, previousTime) {
		return parseInt(currentTime) - parseInt(previousTime);
	}

	// Evaluates total zoom based upon consecutive zoom keypresses
	evaluateZoomScale(element, direction) {
    	let currentTime = Date.now(),
    		previousTime = currentTime,
			timeDiff = this.getTimeDiff(currentTime, previousTime),
			keypressCount = 0;

		// First keypress in a series
		if (keypressCount === 0) {
			let startTime = currentTime;
			keypressCount++;

			this.bigCssZoom(element, 'in', keypressCount);

			previousTime = currentTime;	

		// This keypress occurred within half a second of the last
		} else {
			if (this.getTimeDiff(currentTime, previousTime) < 250) {
				keypressCount++;

				// Wait half a second and check to see if any more of these same
				// keypresses have occurred.  If not, then currentCount will equal
				// the count.  It is only then that we want to calculate and invoke
				// the zoom function
				this.bigCssZoom(element, 'in', keypressCount);
			}

			previousTime = currentTime;						
		}
	}

	setupZoomInKey() {
		$(document).keydown( (e) => {
			if (e.keyCode === this.plusKey) {
				this.evaluateZoomScale(this.impressContainer, 'in');
			}
		});
	}

	setupZoomOutKey() {
		$(document).keydown( (e) => {
			if (e.keyCode === this.minusKey) {
				this.evaluateZoomScale(this.impressContainer, 'out');
			}
		});
	}
}
