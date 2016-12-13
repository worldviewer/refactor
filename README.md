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

- "Uncaught ReferenceError: require is not defined": Babel will transpile ES6 -> ES5, but it will not perform the module bundling for you ...

http://stackoverflow.com/questions/31593694/do-i-need-require-js-when-i-use-babel

https://stackoverflow.com/questions/28125554/javascript-6to5-now-babel-export-module-usage

https://github.com/substack/browserify-handbook

- jQuery Kinetic produces errors if I simply drop the code into the directory, but works fine if I add it via npm.


