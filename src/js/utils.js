// Explanation of how to invoke a JS file from within a JS script at ...
// http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file

export default class utils {
	static loadScript(url, callback) {
	    // Adding the script tag to the head as suggested before
	    var head = document.getElementsByTagName('head')[0];
	    var script = document.createElement('script');
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
		var el = document.getElementById(elementId);
		var st = window.getComputedStyle(el, null);
		var tr = st.getPropertyValue("-webkit-transform") ||
		         st.getPropertyValue("-moz-transform") ||
		         st.getPropertyValue("-ms-transform") ||
		         st.getPropertyValue("-o-transform") ||
		         st.getPropertyValue("transform") ||
		         "fail...";

		// With rotate(30deg)...
		// matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
		console.log('Matrix: ' + tr);

		// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

		var values = tr.split('(')[1];
		    values = values.split(')')[0];
		    values = values.split(',');
		var a = values[0];
		var b = values[1];
		var c = values[2];
		var d = values[3];

		console.log("scale: " + Math.sqrt(a*a + b*b));

		return(Math.sqrt(a*a + b*b));
	}

	static hasClass(elem, className) {
	    return elem.className.split(' ').indexOf(className) > -1;
	}
}
