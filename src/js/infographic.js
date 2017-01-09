export default class Infographic {
	constructor() {
		// Materialize.css does not currently work well with iPad touches, so for now,
		// I'm going to bump tablet users to the simpler mobile interface ...
		//
		// Explanations of the problem here ...
		// http://www.danwellman.co.uk/fixing-jquery-click-events-for-the-ipad/
		// https://github.com/Dogfalo/materialize/issues/2319
		
		this.isDesktop = !device.mobile() && !device.tablet();
	}
}
