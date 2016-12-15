import Cookies from 'js-cookie';

export default class Infographic {
	constructor() {
		this.deviceCookie = Cookies.get('display');
		this.isDesktop = !device.mobile() && !device.tablet();
	}
}
