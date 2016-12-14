# Refactor of the Original Worldviewer Infographic Viewer

To view the current state of the refactor, go <a href="http://worldviewer.github.io/refactor/">here</a>.

<p align="center">
  <img src="https://github.com/worldviewer/worldviewer.github.io/blob/master/infographic-desktop.jpg" />
</p>

## Immediate Goals

- How much can I reduce load time, compared to the older version?
  Eliminate unused code
  Minify Javascript
  Asynchronous loading / other http2 optimizations
- How much can I reduce the total number of assets?
- Can I completely eliminate the inactive loading state?
- Set up a modern workflow
  Experiment with npm scripts
- Refactor into ES6 / SCSS
- Improve code readability
  Break up into modules and classes
  Reconsider variable and function naming
- Explore the possibility of a more responsive approach
  Can impress.js run on a mobile device?
  Is there an intuitive UI for smaller devices which extends desktop approach?
- Can I eliminate hardcoded URL's?

## Notes

"Uncaught ReferenceError: require is not defined": Babel will transpile ES6 -> ES5, but it will not perform the module bundling for you ...

http://stackoverflow.com/questions/31593694/do-i-need-require-js-when-i-use-babel

https://stackoverflow.com/questions/28125554/javascript-6to5-now-babel-export-module-usage

https://github.com/substack/browserify-handbook

jQuery Kinetic produces errors if I simply drop the code into the directory, but works fine if I add it via npm.  Presuming it's a dependency issue, moving on.

Materialize.css: This package runs into serious issues when bundling.  I've attempted to create a Browserify shim to address them, but each time I resolve one dependency error, I get another ...

// package.json

    {
      "name": "refactor",
      "version": "1.0.0",
      "description": "Original: http://worldviewer.github.io/, Refactor: http://worldviewer.github.io/refactor/",
      "main": "main.js",
      "scripts": {
        "postinstall": "cp ./src/lib/js/materialize.js ./node_modules/materialize-css/bin",
        "build": "npm run babel && npm run scss && npm run autoprefixer && npm run browserify",
        "babel": "babel src/js -d src/tmp",
        "scss": "node-sass --output-style compressed -o dist/css src/scss src/lib/scss",
        "autoprefixer": "postcss -u autoprefixer -r dist/css/*",
        "browserify": "browserify src/lib/js/* src/tmp/* -o dist/js/app.js"
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/worldviewer/refactor.git"
      },
      "author": "Chris Reeve",
      "license": "ISC",
      "bugs": {
        "url": "https://github.com/worldviewer/refactor/issues"
      },
      "browserify": {
        "transform": [
          "browserify-shim"
        ]
      },
      "browserify-shim": {
        "materialize-js": {
          "exports": "Materialize",
          "depends": [
            "velocity:Vel",
            "jquery-js:jQuery",
            "pickadate-js:picker",
            "hammer-js:hammer"
          ]
        }
      },
      "browser": {
        "jquery-js": "./node_modules/jquery/dist/jquery.js",
        "materialize-js": "./node_modules/materialize-css/bin/materialize.js",
        "velocity": "./node_modules/velocity-animate/velocity.js",
        "pickadate-js": "./node_modules/pickadate/lib/picker.js",
        "hammer-js": "./node_modules/hammer/js/hammer.js"
      },
      "homepage": "https://github.com/worldviewer/refactor#readme",
      "dependencies": {
        "hammerjs": "^2.0.8",
        "jquery": "^3.1.1",
        "jquery.kinetic": "^2.1.1",
        "jquery.scrollto": "^2.1.2",
        "js-cookie": "^2.1.3",
        "pickadate": "^3.5.6",
        "scrollmagic": "^2.0.5",
        "velocity-animate": "^1.4.0",
        "materialize-css": "^0.97.8"
      },
      "devDependencies": {
        "autoprefixer": "^6.5.4",
        "babel-cli": "^6.18.0",
        "babel-preset-latest": "^6.16.0",
        "browserify": "^13.1.1",
        "browserify-shim": "^3.8.12",
        "node-sass": "^4.0.0",
        "postcss-cli": "^2.6.0"
      }
    }

// main.js

    import Infographic from './infographic.js';
    import Cookies from 'js-cookie';
    import ScrollMagic from 'scrollmagic';
    import scrollTo from 'jquery.scrollto';
    import jQuery from 'jquery';
    import Vel from 'velocity-animate';
    import Materialize from 'materialize-css';
    import picker from '../../node_modules/pickadate/lib/picker.js';
    import hammer from '../../node_modules/hammerjs/hammer.js';

This shim does indeed seem to get past some of the more typical errors that I've seen with this issue, but it leaves me with ...



