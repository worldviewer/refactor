// Explanation of how to invoke a JS file from within a JS script at ...
// http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file

export default class utils {
	static loadScript(url, callback) {
	    // Adding the script tag to the head as suggested before
	    let head = document.getElementsByTagName('head')[0];
	    let script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;

	    // Then bind the event to the callback function.
	    // There are several events for cross browser compatibility.
	    script.onreadystatechange = callback;
	    script.onload = callback;

	    // Fire the loading
	    head.appendChild(script);
	}

	// This function returns the current scale of the element marked with
	// the ID passed.  Comes from site here ...
	// https://css-tricks.com/get-value-of-css-rotation-through-javascript/
	static getScale(elementId) {
		let element = document.getElementById(elementId),
			style = window.getComputedStyle(element, null),
			transform = style.getPropertyValue("-webkit-transform") ||
		         style.getPropertyValue("-moz-transform") ||
		         style.getPropertyValue("-ms-transform") ||
		         style.getPropertyValue("-o-transform") ||
		         style.getPropertyValue("transform") ||
		         "fail...";

		// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

		let values = transform.split('(')[1];
		    values = values.split(')')[0];
		    values = values.split(',');
		let a = values[0];
		let b = values[1];
		let c = values[2];
		let d = values[3];

		return(Math.sqrt(a*a + b*b));
	}

	static hasClass(elem, className) {
	    return elem.className.split(' ').indexOf(className) > -1;
	}
}
