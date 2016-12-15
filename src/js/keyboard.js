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
		setupSideNavToggle();
		setupZoomOutKey();
		setupZoomInKey();

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

	setupZoomInKey() {
		$(document).keydown( (e) => {
			if (e.keyCode === this.plusKey) {
		    	currentTime = Date.now();
				console.log("current time: " + currentTime);
				console.log("previous time: " + previousTime);
				timeDiff = parseInt(currentTime) - parseInt(previousTime);
				console.log("time diff: " + timeDiff);

				// First keypress in a series
				if (keypressCount === 0) {
					startTime = currentTime;
					keypressCount++;
					console.log('keypress count: ' + keypressCount);

					setTimeout( (currentCount) => {
						console.log('keypress count: ' + keypressCount + ", currentCount: " + currentCount);
						if (currentCount === count) {
							factor = Math.pow(Math.log(count + 2), 3);
							this.impressContainer.css('transform', 'scale(' + utils.getScale("impress")*factor + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
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
								count = 0;
							}
						}, 500, count);
					}

					previous = current;								
				}
			}
		});
	}

	setupZoomOutKey() {
		$(document).keydown( (e) => {
			if (e.keyCode === this.minusKey) {
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
								count = 0;
							}
						}, 500, count);
					}

					previous = current;								
				}
			}
		});
	}
}