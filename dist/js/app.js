(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 jQuery.kinetic v2.1.1
 Dave Taylor http://davetayls.me

 @license The MIT License (MIT)
 @preserve Copyright (c) 2012 Dave Taylor http://davetayls.me
 */
(function ($){
  'use strict';

  var ACTIVE_CLASS = 'kinetic-active';

  /**
   * Provides requestAnimationFrame in a cross browser way.
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */
  if (!window.requestAnimationFrame){

    window.requestAnimationFrame = ( function (){

      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
          window.setTimeout(callback, 1000 / 60);
        };

    }());

  }

  // add touch checker to jQuery.support
  $.support = $.support || {};
  $.extend($.support, {
    touch: 'ontouchend' in document
  });
  var selectStart = function (){
    return false;
  };


  // KINETIC CLASS DEFINITION
  // ======================

  var Kinetic = function (element, settings) {
    this.settings = settings;
    this.el       = element;
    this.$el      = $(element);

    this._initElements();

    return this;
  };

  Kinetic.DATA_KEY = 'kinetic';
  Kinetic.DEFAULTS = {
    cursor: 'move',
    decelerate: true,
    triggerHardware: false,
    threshold: 0,
    y: true,
    x: true,
    slowdown: 0.9,
    maxvelocity: 40,
    throttleFPS: 60,
    movingClass: {
      up: 'kinetic-moving-up',
      down: 'kinetic-moving-down',
      left: 'kinetic-moving-left',
      right: 'kinetic-moving-right'
    },
    deceleratingClass: {
      up: 'kinetic-decelerating-up',
      down: 'kinetic-decelerating-down',
      left: 'kinetic-decelerating-left',
      right: 'kinetic-decelerating-right'
    }
  };


  // Public functions

  Kinetic.prototype.start = function (options){
    this.settings = $.extend(this.settings, options);
    this.velocity = options.velocity || this.velocity;
    this.velocityY = options.velocityY || this.velocityY;
    this.settings.decelerate = false;
    this._move();
  };

  Kinetic.prototype.end = function (){
    this.settings.decelerate = true;
  };

  Kinetic.prototype.stop = function (){
    this.velocity = 0;
    this.velocityY = 0;
    this.settings.decelerate = true;
    if ($.isFunction(this.settings.stopped)){
      this.settings.stopped.call(this);
    }
  };

  Kinetic.prototype.detach = function (){
    this._detachListeners();
    this.$el
      .removeClass(ACTIVE_CLASS)
      .css('cursor', '');
  };

  Kinetic.prototype.attach = function (){
    if (this.$el.hasClass(ACTIVE_CLASS)) {
      return;
    }
    this._attachListeners(this.$el);
    this.$el
      .addClass(ACTIVE_CLASS)
      .css('cursor', this.settings.cursor);
  };


  // Internal functions

  Kinetic.prototype._initElements = function (){
    this.$el.addClass(ACTIVE_CLASS);

    $.extend(this, {
      xpos: null,
      prevXPos: false,
      ypos: null,
      prevYPos: false,
      mouseDown: false,
      throttleTimeout: 1000 / this.settings.throttleFPS,
      lastMove: null,
      elementFocused: null
    });

    this.velocity = 0;
    this.velocityY = 0;

    // make sure we reset everything when mouse up
    $(document)
      .mouseup($.proxy(this._resetMouse, this))
      .click($.proxy(this._resetMouse, this));

    this._initEvents();

    this.$el.css('cursor', this.settings.cursor);

    if (this.settings.triggerHardware){
      this.$el.css({
        '-webkit-transform': 'translate3d(0,0,0)',
        '-webkit-perspective': '1000',
        '-webkit-backface-visibility': 'hidden'
      });
    }
  };

  Kinetic.prototype._initEvents = function(){
    var self = this;
    this.settings.events = {
      touchStart: function (e){
        var touch;
        if (self._useTarget(e.target, e)){
          touch = e.originalEvent.touches[0];
          self.threshold = self._threshold(e.target, e);
          self._start(touch.clientX, touch.clientY);
          e.stopPropagation();
        }
      },
      touchMove: function (e){
        var touch;
        if (self.mouseDown){
          touch = e.originalEvent.touches[0];
          self._inputmove(touch.clientX, touch.clientY);
          if (e.preventDefault){
            e.preventDefault();
          }
        }
      },
      inputDown: function (e){
        if (self._useTarget(e.target, e)){
          self.threshold = self._threshold(e.target, e);
          self._start(e.clientX, e.clientY);
          self.elementFocused = e.target;
          if (e.target.nodeName === 'IMG'){
            e.preventDefault();
          }
          e.stopPropagation();
        }
      },
      inputEnd: function (e){
        if (self._useTarget(e.target, e)){
          self._end();
          self.elementFocused = null;
          if (e.preventDefault){
            e.preventDefault();
          }
        }
      },
      inputMove: function (e){
        if (self.mouseDown){
          self._inputmove(e.clientX, e.clientY);
          if (e.preventDefault){
            e.preventDefault();
          }
        }
      },
      scroll: function (e){
        if ($.isFunction(self.settings.moved)){
          self.settings.moved.call(self, self.settings);
        }
        if (e.preventDefault){
          e.preventDefault();
        }
      },
      inputClick: function (e){
        if (Math.abs(self.velocity) > 0){
          e.preventDefault();
          return false;
        }
      },
      // prevent drag and drop images in ie
      dragStart: function (e){
        if (self._useTarget(e.target, e) && self.elementFocused){
          return false;
        }
      }
    };

    this._attachListeners(this.$el, this.settings);

  };

  Kinetic.prototype._inputmove = function (clientX, clientY){
    var $this = this.$el;
    var el = this.el;

    if (!this.lastMove || new Date() > new Date(this.lastMove.getTime() + this.throttleTimeout)){
      this.lastMove = new Date();

      if (this.mouseDown && (this.xpos || this.ypos)){
        var movedX = (clientX - this.xpos);
        var movedY = (clientY - this.ypos);
        if(this.threshold > 0){
          var moved = Math.sqrt(movedX * movedX + movedY * movedY);
          if(this.threshold > moved){
            return;
          } else {
            this.threshold = 0;
          }
        }
        if (this.elementFocused){
          $(this.elementFocused).blur();
          this.elementFocused = null;
          $this.focus();
        }

        this.settings.decelerate = false;
        this.velocity = this.velocityY = 0;

        var scrollLeft = this.scrollLeft();
        var scrollTop = this.scrollTop();

        this.scrollLeft(this.settings.x ? scrollLeft - movedX : scrollLeft);
        this.scrollTop(this.settings.y ? scrollTop - movedY : scrollTop);

        this.prevXPos = this.xpos;
        this.prevYPos = this.ypos;
        this.xpos = clientX;
        this.ypos = clientY;

        this._calculateVelocities();
        this._setMoveClasses(this.settings.movingClass);

        if ($.isFunction(this.settings.moved)){
          this.settings.moved.call(this, this.settings);
        }
      }
    }
  };

  Kinetic.prototype._calculateVelocities = function (){
    this.velocity = this._capVelocity(this.prevXPos - this.xpos, this.settings.maxvelocity);
    this.velocityY = this._capVelocity(this.prevYPos - this.ypos, this.settings.maxvelocity);
  };

  Kinetic.prototype._end = function (){
    if (this.xpos && this.prevXPos && this.settings.decelerate === false){
      this.settings.decelerate = true;
      this._calculateVelocities();
      this.xpos = this.prevXPos = this.mouseDown = false;
      this._move();
    }
  };

  Kinetic.prototype._useTarget = function (target, event){
    if ($.isFunction(this.settings.filterTarget)){
      return this.settings.filterTarget.call(this, target, event) !== false;
    }
    return true;
  };

  Kinetic.prototype._threshold = function (target, event){
    if ($.isFunction(this.settings.threshold)){
      return this.settings.threshold.call(this, target, event);
    }
    return this.settings.threshold;
  };

  Kinetic.prototype._start = function (clientX, clientY){
    this.mouseDown = true;
    this.velocity = this.prevXPos = 0;
    this.velocityY = this.prevYPos = 0;
    this.xpos = clientX;
    this.ypos = clientY;
  };

  Kinetic.prototype._resetMouse = function (){
    this.xpos = false;
    this.ypos = false;
    this.mouseDown = false;
  };

  Kinetic.prototype._decelerateVelocity = function (velocity, slowdown){
    return Math.floor(Math.abs(velocity)) === 0 ? 0 // is velocity less than 1?
      : velocity * slowdown; // reduce slowdown
  };

  Kinetic.prototype._capVelocity = function (velocity, max){
    var newVelocity = velocity;
    if (velocity > 0){
      if (velocity > max){
        newVelocity = max;
      }
    } else {
      if (velocity < (0 - max)){
        newVelocity = (0 - max);
      }
    }
    return newVelocity;
  };

  Kinetic.prototype._setMoveClasses = function (classes){
    // FIXME: consider if we want to apply PL #44, this should not remove
    // classes we have not defined on the element!
    var settings = this.settings;
    var $this = this.$el;

    $this.removeClass(settings.movingClass.up)
      .removeClass(settings.movingClass.down)
      .removeClass(settings.movingClass.left)
      .removeClass(settings.movingClass.right)
      .removeClass(settings.deceleratingClass.up)
      .removeClass(settings.deceleratingClass.down)
      .removeClass(settings.deceleratingClass.left)
      .removeClass(settings.deceleratingClass.right);

    if (this.velocity > 0){
      $this.addClass(classes.right);
    }
    if (this.velocity < 0){
      $this.addClass(classes.left);
    }
    if (this.velocityY > 0){
      $this.addClass(classes.down);
    }
    if (this.velocityY < 0){
      $this.addClass(classes.up);
    }

  };


  // do the actual kinetic movement
  Kinetic.prototype._move = function (){
    var $scroller = this.$el;
    var scroller = this.el;
    var self = this;
    var settings = self.settings;

    // set scrollLeft
    if (settings.x && scroller.scrollWidth > 0){
      this.scrollLeft(this.scrollLeft() + this.velocity);
      if (Math.abs(this.velocity) > 0){
        this.velocity = settings.decelerate ?
          self._decelerateVelocity(this.velocity, settings.slowdown) : this.velocity;
      }
    } else {
      this.velocity = 0;
    }

    // set scrollTop
    if (settings.y && scroller.scrollHeight > 0){
      this.scrollTop(this.scrollTop() + this.velocityY);
      if (Math.abs(this.velocityY) > 0){
        this.velocityY = settings.decelerate ?
          self._decelerateVelocity(this.velocityY, settings.slowdown) : this.velocityY;
      }
    } else {
      this.velocityY = 0;
    }

    self._setMoveClasses(settings.deceleratingClass);

    if ($.isFunction(settings.moved)){
      settings.moved.call(this, settings);
    }

    if (Math.abs(this.velocity) > 0 || Math.abs(this.velocityY) > 0){
      if (!this.moving) {
        this.moving = true;
        // tick for next movement
        window.requestAnimationFrame(function (){
          self.moving = false;
          self._move();
        });
      }
    } else {
      self.stop();
    }
  };

  // get current scroller to apply positioning to
  Kinetic.prototype._getScroller = function(){
    var $scroller = this.$el;
    if (this.$el.is('body') || this.$el.is('html')){
      $scroller = $(window);
    }
    return $scroller;
  };

  // set the scroll position
  Kinetic.prototype.scrollLeft = function(left){
    var $scroller = this._getScroller();
    if (typeof left === 'number'){
      $scroller.scrollLeft(left);
      this.settings.scrollLeft = left;
    } else {
      return $scroller.scrollLeft();
    }
  };
  Kinetic.prototype.scrollTop = function(top){
    var $scroller = this._getScroller();
    if (typeof top === 'number'){
      $scroller.scrollTop(top);
      this.settings.scrollTop = top;
    } else {
      return $scroller.scrollTop();
    }
  };

  Kinetic.prototype._attachListeners = function (){
    var $this = this.$el;
    var settings = this.settings;

    if ($.support.touch){
      $this
        .bind('touchstart', settings.events.touchStart)
        .bind('touchend', settings.events.inputEnd)
        .bind('touchmove', settings.events.touchMove);
    }
    
    $this
      .mousedown(settings.events.inputDown)
      .mouseup(settings.events.inputEnd)
      .mousemove(settings.events.inputMove);

    $this
      .click(settings.events.inputClick)
      .scroll(settings.events.scroll)
      .bind('selectstart', selectStart) // prevent selection when dragging
      .bind('dragstart', settings.events.dragStart);
  };

  Kinetic.prototype._detachListeners = function (){
    var $this = this.$el;
    var settings = this.settings;
    if ($.support.touch){
      $this
        .unbind('touchstart', settings.events.touchStart)
        .unbind('touchend', settings.events.inputEnd)
        .unbind('touchmove', settings.events.touchMove);
    }

    $this
      .unbind('mousedown', settings.events.inputDown)
      .unbind('mouseup', settings.events.inputEnd)
      .unbind('mousemove', settings.events.inputMove);

    $this
      .unbind('click', settings.events.inputClick)
      .unbind('scroll', settings.events.scroll)
      .unbind('selectstart', selectStart) // prevent selection when dragging
      .unbind('dragstart', settings.events.dragStart);
  };


  // EXPOSE KINETIC CONSTRUCTOR
  // ==========================
  $.Kinetic = Kinetic;

  // KINETIC PLUGIN DEFINITION
  // =======================

  $.fn.kinetic = function (option, callOptions) {
    return this.each(function () {
      var $this    = $(this);
      var instance = $this.data(Kinetic.DATA_KEY);
      var options  = $.extend({}, Kinetic.DEFAULTS, $this.data(), typeof option === 'object' && option);

      if (!instance) {
        $this.data(Kinetic.DATA_KEY, (instance = new Kinetic(this, options)));
      }

      if (typeof option === 'string') {
        instance[option](callOptions);
      }

    });
  };

}(window.jQuery || window.Zepto));


},{}],2:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],3:[function(require,module,exports){
/*! device.js 0.2.7 */
(function(){var a,b,c,d,e,f,g,h,i,j;b=window.device,a={},window.device=a,d=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),a.ios=function(){return a.iphone()||a.ipod()||a.ipad()},a.iphone=function(){return!a.windows()&&e("iphone")},a.ipod=function(){return e("ipod")},a.ipad=function(){return e("ipad")},a.android=function(){return!a.windows()&&e("android")},a.androidPhone=function(){return a.android()&&e("mobile")},a.androidTablet=function(){return a.android()&&!e("mobile")},a.blackberry=function(){return e("blackberry")||e("bb10")||e("rim")},a.blackberryPhone=function(){return a.blackberry()&&!e("tablet")},a.blackberryTablet=function(){return a.blackberry()&&e("tablet")},a.windows=function(){return e("windows")},a.windowsPhone=function(){return a.windows()&&e("phone")},a.windowsTablet=function(){return a.windows()&&e("touch")&&!a.windowsPhone()},a.fxos=function(){return(e("(mobile;")||e("(tablet;"))&&e("; rv:")},a.fxosPhone=function(){return a.fxos()&&e("mobile")},a.fxosTablet=function(){return a.fxos()&&e("tablet")},a.meego=function(){return e("meego")},a.cordova=function(){return window.cordova&&"file:"===location.protocol},a.nodeWebkit=function(){return"object"==typeof window.process},a.mobile=function(){return a.androidPhone()||a.iphone()||a.ipod()||a.windowsPhone()||a.blackberryPhone()||a.fxosPhone()||a.meego()},a.tablet=function(){return a.ipad()||a.androidTablet()||a.blackberryTablet()||a.windowsTablet()||a.fxosTablet()},a.desktop=function(){return!a.tablet()&&!a.mobile()},a.television=function(){var a;for(television=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"],a=0;a<television.length;){if(e(television[a]))return!0;a++}return!1},a.portrait=function(){return window.innerHeight/window.innerWidth>1},a.landscape=function(){return window.innerHeight/window.innerWidth<1},a.noConflict=function(){return window.device=b,this},e=function(a){return-1!==j.indexOf(a)},g=function(a){var b;return b=new RegExp(a,"i"),d.className.match(b)},c=function(a){var b=null;g(a)||(b=d.className.replace(/^\s+|\s+$/g,""),d.className=b+" "+a)},i=function(a){g(a)&&(d.className=d.className.replace(" "+a,""))},a.ios()?a.ipad()?c("ios ipad tablet"):a.iphone()?c("ios iphone mobile"):a.ipod()&&c("ios ipod mobile"):a.android()?c(a.androidTablet()?"android tablet":"android mobile"):a.blackberry()?c(a.blackberryTablet()?"blackberry tablet":"blackberry mobile"):a.windows()?c(a.windowsTablet()?"windows tablet":a.windowsPhone()?"windows mobile":"desktop"):a.fxos()?c(a.fxosTablet()?"fxos tablet":"fxos mobile"):a.meego()?c("meego mobile"):a.nodeWebkit()?c("node-webkit"):a.television()?c("television"):a.desktop()&&c("desktop"),a.cordova()&&c("cordova"),f=function(){a.landscape()?(i("portrait"),c("landscape")):(i("landscape"),c("portrait"))},h=Object.prototype.hasOwnProperty.call(window,"onorientationchange")?"orientationchange":"resize",window.addEventListener?window.addEventListener(h,f,!1):window.attachEvent?window.attachEvent(h,f):window[h]=f,f(),"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?module.exports=a:window.device=a}).call(this);
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _infographic = require('./infographic.js');

var _infographic2 = _interopRequireDefault(_infographic);

var _keyboard = require('./keyboard.js');

var _keyboard2 = _interopRequireDefault(_keyboard);

var _jqueryKinetic = require('../../node_modules/jquery.kinetic/jquery.kinetic.js');

var _jqueryKinetic2 = _interopRequireDefault(_jqueryKinetic);

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DesktopInfographic = function () {
	function DesktopInfographic() {
		_classCallCheck(this, DesktopInfographic);

		console.log('desktop or tablet window.load()');

		// Presentation
		this.impressContainer = $('#impress');
		this.bigImage = $('.big-image');

		// Materialize
		this.materializeToolTips = $('.tooltipped');
		this.preloaderWrapper = $('.preloader-wrapper');

		// SideNav
		this.sideNav = $('#slide-out');
		this.sideNavListItems = $('.side-nav > li');

		this.hamburgerCollapseIcon = $('.button-collapse');
		this.hamburgerExpandIcon = $('#hamburger');

		// Icons
		this.startIcon = $('#start');
		this.endIcon = $('#end');
		this.mobileViewIcon = $('#mobile-view');
		this.zoomInIcon = $('#zoom-in');
		this.zoomOutIcon = $('#zoom-out');
		this.previousSlideIcon = $('#previous-slide');
		this.nextSlideIcon = $('#next-slide');
		this.discussSlideIcon = $('#discuss-slide');

		this.init();
	}

	_createClass(DesktopInfographic, [{
		key: 'init',
		value: function init() {
			var _this = this;

			$(window).on('load', function () {
				console.log("desktop or tablet window.on(load)");

				_this.impressContainer.attr('data-set-scale-factor', 1);

				_this.materializeToolTips.tooltip({ delay: 50 });

				_this.initSideNav();

				_this.showControls();

				Materialize.toast('Use < / > keys to navigate, + / - to zoom', 10000);

				_this.showSideNav();

				_this.bigImage.show();

				setTimeout(function () {
					_this.preloaderWrapper.removeClass('active');
					_this.bigImage.addClass('animated fadeIn').css('visibility', 'visible');

					_this.loadImpress();
				}, 4000);
			});
		}
	}, {
		key: 'showControls',
		value: function showControls() {
			this.startIcon.addClass('animated fadeInUp').css('visibility', 'visible');
			this.endIcon.addClass('animated fadeInUp').css('visibility', 'visible');
			this.mobileViewIcon.addClass('animated fadeInRight').css('visibility', 'visible');
			this.zoomInIcon.addClass('animated fadeInRight').css('visibility', 'visible');
			this.zoomOutIcon.addClass('animated fadeInRight').css('visibility', 'visible');
			this.previousSlideIcon.addClass('animated fadeInUp').css('visibility', 'visible');
			this.nextSlideIcon.addClass('animated fadeInUp').css('visibility', 'visible');
			this.discussSlideIcon.addClass('animated fadeInRight').css('visibility', 'visible');
		}
	}, {
		key: 'showSideNav',
		value: function showSideNav() {
			this.sideNav.show();
			this.sideNav.addClass('animated fadeInLeft').css('visibility', 'visible');
		}
	}, {
		key: 'initSideNav',
		value: function initSideNav() {
			// Expand sideNav
			this.hamburgerCollapseIcon.sideNav({
				menuWidth: 360 // Default is 240
			});

			this.hamburgerCollapseIcon.sideNav('show');
			this.sideNav.addClass('active');
		}
	}, {
		key: 'loadImpress',
		value: function loadImpress() {
			var _this2 = this;

			var setup = function setup() {
				return _this2.setupHandlers();
			};

			// Add in drag scroll once all animations have completed.  For some reason,
			// I'm not able to get the deceleration to work for this, even when I modify
			// the slowdown value in the original code ...
			$(window).kinetic();

			_utils2.default.loadScript("dist/js/impress.js", setup);
		}
	}, {
		key: 'setupHandlers',
		value: function setupHandlers() {
			impress().init();

			this.setupHamburger();
			this.setupHashChange();
			this.setupMobileChange();
			this.setupZooms();
			this.setupDiscuss();
			this.setupNextPrev();
			this.setupKeypresses();
		}
	}, {
		key: 'setupHamburger',
		value: function setupHamburger() {
			var _this3 = this;

			// Allow side-nav collapse by pressing the hamburger icon
			this.hamburgerCollapseIcon.on('click', function () {
				// $("#slide").animate({width:'toggle'},350);
				// $('.button-collapse').sideNav('hide');
				_this3.sideNav.removeClass('active');

				_this3.hamburgerExpandIcon.css('visibility', 'visible');

				console.log("collapse side-nav");
			});

			// Show side-nav bar when corner hamburger is clicked
			this.hamburgerExpandIcon.on('click', function () {
				_this3.hamburgerCollapseIcon.sideNav('show');
				_this3.sideNav.addClass('active');
				_this3.hamburgerExpandIcon.css('visibility', 'hidden');
			});
		}
	}, {
		key: 'setupHashChange',
		value: function setupHashChange() {
			var _this4 = this;

			// DECORATING LIST ITEM BORDER FOR CONTENT SLIDES
			// (URL CHANGE --> LI CHANGE)
			// $('#impress > .present').attr('id') can be used to grab the id that is currently
			// activated by impress.js, and with that, we can can apply border styling to
			// the right border of $('.side-nav > li[id="id"');

			$(window).on('hashchange', function (e) {
				console.log('slide transition');

				// grab active impress.js slide ID
				var currentSlideHash = $('#impress .active').attr('id');

				// Reality-check to console
				console.log("current slide hash: " + currentSlideHash);

				// toggle the active-slide class for the list item with that ID
				_this4.sideNavListItems.removeClass('active-slide');
				$('.side-nav li[data-slide=\"' + currentSlideHash + '\"]').toggleClass('active-slide');
			});

			// MOVING INFOGRAPHIC FOCUS BASED UPON CLICKS TO SIDE-NAV
			// (LI CLICK --> URL CHANGE)
			// clicks on $('.side-nav > li') should grab data('slide'), and window.location.hash = 
			// '#your-page-element';

			this.sideNavListItems.on('click', function () {
				console.log('click-induced transition');

				window.location.hash = '#' + $(_this4).data('slide');
			});

			this.startIcon.on('click', function () {
				window.location.hash = '#intro';
			});

			this.endIcon.on('click', function () {
				window.location.hash = '#futurism';
			});
		}

		// REMOVE

	}, {
		key: 'setupMobileChange',
		value: function setupMobileChange() {
			// I want to persist this setting between sessions, so I'll use js.cookie.js
			// Usage information here ...
			// https://github.com/js-cookie/js-cookie
			//
			// Cookies.set('name', 'value');
			//
			// Valid across entire site ...
			// Cookies.set('name', 'value', { expires: 7 });
			// 
			// Cookies.get('name'); // => 'value'
			// Cookies.get('nothing'); // => undefined

			this.mobileViewIcon.on('click', function () {
				Cookies.set('display', 'mobile', { expires: 365 });

				console.log("display: " + Cookies.get('display'));

				// Then reload the page ...
				document.location.reload();
			});
		}
	}, {
		key: 'setupZooms',
		value: function setupZooms() {
			var _this5 = this;

			// jQuery automatically adds in necessary vendor prefixes when using
			// .css().  See https://css-tricks.com/how-to-deal-with-vendor-prefixes/.
			this.zoomInIcon.on('click', function () {
				_this5.impressContainer.css('transform', 'scale(' + _utils2.default.getScale("impress") * 1.25 + ')');
			});

			this.zoomOutIcon.on('click', function () {
				_this5.impressContainer.css('transform', 'scale(' + _utils2.default.getScale("impress") / 1.25 + ')');
			});
		}
	}, {
		key: 'setupDiscuss',
		value: function setupDiscuss() {
			this.discussSlideIcon.on('click', function () {});
		}
	}, {
		key: 'setupNextPrev',
		value: function setupNextPrev() {
			this.previousSlideIcon.on('click', function () {
				// This approach does not work because it does not preventDefault(),
				// and the key is already being captured by impress.js, which causes
				// a conflict ...

				// var e = jQuery.Event("keydown");
				// e.which = 37;
				// e.keyCode = 37;
				// $(document).trigger(e);

				// Instead, we can in this case just use impress ...
				impress().prev();

				// And see below for an example of how to capture keypresses in other
				// cases ...
			});

			this.nextSlideIcon.on('click', function () {
				impress().next();
			});
		}
	}, {
		key: 'setupKeypresses',
		value: function setupKeypresses() {
			var keyboard = new _keyboard2.default(this.impressContainer, this.sideNav, this.hamburgerCollapseIcon, this.hamburgerExpandIcon);

			keyboard.init();
		}
	}]);

	return DesktopInfographic;
}();

exports.default = DesktopInfographic;
},{"../../node_modules/jquery.kinetic/jquery.kinetic.js":1,"./infographic.js":5,"./keyboard.js":6,"./utils.js":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _jsCookie = require('js-cookie');

var _jsCookie2 = _interopRequireDefault(_jsCookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Infographic = function Infographic() {
	_classCallCheck(this, Infographic);

	// Materialize.css does not currently work well with iPad touches, so for now,
	// I'm going to bump tablet users to the simpler mobile interface ...
	//
	// Explanations of the problem here ...
	// http://www.danwellman.co.uk/fixing-jquery-click-events-for-the-ipad/
	// https://github.com/Dogfalo/materialize/issues/2319

	this.deviceCookie = _jsCookie2.default.get('display');
	this.isDesktop = !device.mobile() && !device.tablet();
};

exports.default = Infographic;
},{"js-cookie":2}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Note that impress maps both the right/left arrows and page down/up for slide next/previous
var Keyboard = function () {
	function Keyboard(impressContainer, sideNav, hamburgerCollapseIcon, hamburgerExpandIcon) {
		_classCallCheck(this, Keyboard);

		this.impressContainer = impressContainer;
		this.sideNav = sideNav;
		this.hamburgerCollapseIcon = hamburgerCollapseIcon;
		this.hamburgerExpandIcon = hamburgerExpandIcon;

		this.tabKey = 9; // toggle sideNav
		this.plusKey = 187; // zoom in
		this.minusKey = 189; // zoom out
		this.keypressCount = 0; // counts successive + or -
	}

	_createClass(Keyboard, [{
		key: 'init',
		value: function init() {
			var _this = this;

			this.setupSideNavToggle();
			this.setupZoomOutKey();
			this.setupZoomInKey();

			$(document).keydown(function (e) {
				if (e.keyCode === _this.tabKey || e.keyCode === _this.minusKey || e.keyCode === _this.plusKey) {

					console.log("key code: " + e.keyCode);
					e.preventDefault();
				}
			});
		}
	}, {
		key: 'setupSideNavToggle',
		value: function setupSideNavToggle() {
			var _this2 = this;

			$(document).keydown(function (e) {
				if (e.keyCode === _this2.tabKey) {
					if (_this2.sideNav.hasClass('active')) {
						_this2.hamburgerCollapseIcon.trigger('click');
					} else {
						_this2.hamburgerExpandIcon.trigger('click');
					}
				}
			});
		}

		// This zoom equation was derived through trial and error

	}, {
		key: 'calculateZoom',
		value: function calculateZoom(keypressCount) {
			return Math.pow(Math.log(keypressCount + 2), 3);
		}

		// Calculates new scale based upon previous

	}, {
		key: 'calculateScale',
		value: function calculateScale(element, direction, factor) {
			console.log('factor: ' + factor);

			return direction === 'in' ? _utils2.default.getScale(element.attr('id')) * factor : _utils2.default.getScale(element.attr('id')) / factor;
		}

		// Zooms via CSS transform

	}, {
		key: 'cssZoom',
		value: function cssZoom(element, direction, factor) {
			var newScale = this.calculateScale(element, direction, factor);
			console.log('New scale: ' + newScale);

			element.css('transform', 'scale(' + newScale + ')').css('transition-duration', '0.25s').css('transition-delay', '0');
		}
	}, {
		key: 'getTimeDiff',
		value: function getTimeDiff(currentTime, previousTime) {
			return parseInt(currentTime) - parseInt(previousTime);
		}

		// Allows user to zoom in rapidly with consecutive keypresses

	}, {
		key: 'bigCssZoom',
		value: function bigCssZoom(element, direction) {
			var _this3 = this;

			var factor = this.calculateZoom(this.keypressCount);

			setTimeout(function (currentCount) {
				// waits a half sec, then does nothing if another key event has been created,
				// incrementing keypressCount past the currentCount for this former event
				if (currentCount === _this3.keypressCount) {
					console.log('key presses: ' + _this3.keypressCount);
					_this3.cssZoom(element, direction, factor);
					_this3.keypressCount = 0; // reset for next sequence
				}
			}, 500, this.keypressCount);

			this.previousTime = this.currentTime; // reset our clock for next keypress
		}

		// Evaluates total zoom based upon the number of consecutive zoom keypresses

	}, {
		key: 'evaluateZoomScale',
		value: function evaluateZoomScale(element, direction) {
			this.currentTime = Date.now();
			var timeDiff = this.getTimeDiff(this.currentTime, this.previousTime);

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
	}, {
		key: 'setupZoomInKey',
		value: function setupZoomInKey() {
			var _this4 = this;

			this.previousTime = Date.now();

			$(document).keydown(function (e) {
				if (e.keyCode === _this4.plusKey) {
					_this4.evaluateZoomScale(_this4.impressContainer, 'in');
				}
			});
		}
	}, {
		key: 'setupZoomOutKey',
		value: function setupZoomOutKey() {
			var _this5 = this;

			this.previousTime = Date.now();

			$(document).keydown(function (e) {
				if (e.keyCode === _this5.minusKey) {
					_this5.evaluateZoomScale(_this5.impressContainer, 'out');
				}
			});
		}
	}]);

	return Keyboard;
}();

exports.default = Keyboard;
},{"./utils.js":9}],7:[function(require,module,exports){
'use strict';

var _infographic = require('./infographic.js');

var _infographic2 = _interopRequireDefault(_infographic);

var _desktopInfographic = require('./desktop-infographic.js');

var _desktopInfographic2 = _interopRequireDefault(_desktopInfographic);

var _mobileInfographic = require('./mobile-infographic.js');

var _mobileInfographic2 = _interopRequireDefault(_mobileInfographic);

var _utils = require('./utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var infographic = new _infographic2.default();
var infographicAsset = "dist/assets/img-desktop/get-big-things-done-1.1.jpg";

$(document).ready(function () {
	console.log('desktop or tablet document.ready()');

	var html = $('html');
	var preloaderWrapper = $('.preloader-wrapper');
	var bigImageContainer = $('#impress > div:first-of-type');

	// Check if user has set a preferred device
	if (infographic.deviceCookie === 'mobile') {
		html.removeClass('desktop').removeClass('tablet').addClass('mobile');
	}

	if (infographic.isDesktop && infographic.deviceCookie !== 'mobile') {
		preloaderWrapper.addClass('active');

		// Dynamically add in the img tag, so that this huge file never downloads for mobile
		// Explanation of how to put Impress in a container here ...
		// https://github.com/impress/impress.js/issues/111

		var bigImage = new Image();
		bigImage.onload = function () {
			console.log('infographic loaded.');

			// For flash of content on page load
			bigImageLoaded(this);

			var desktopInfographic = new _desktopInfographic2.default();
		};
		bigImage.src = infographicAsset;
		bigImage.alt = "Get Big Things Done Infographic";
		bigImage.className = 'big-image';
		bigImageContainer.append(bigImage);
	} else {
		var mobileInfographic = new _mobileInfographic2.default();
		mobileInfographic.init();
	}
});
},{"./desktop-infographic.js":4,"./infographic.js":5,"./mobile-infographic.js":8,"./utils.js":9}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// The former mobile solution will not work for my needs because it involved slicing up
// the graphic into pieces -- an enormously manual process which is not the direction
// I want to go in for this project.
var MobileInfographic = function () {
	function MobileInfographic() {
		_classCallCheck(this, MobileInfographic);

		console.log('Mobile not supported at the moment ...');
	}

	_createClass(MobileInfographic, [{
		key: 'init',
		value: function init() {}
	}]);

	return MobileInfographic;
}();

exports.default = MobileInfographic;
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Explanation of how to invoke a JS file from within a JS script at ...
// http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file

var utils = function () {
	function utils() {
		_classCallCheck(this, utils);
	}

	_createClass(utils, null, [{
		key: 'loadScript',
		value: function loadScript(url, callback) {
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

	}, {
		key: 'getScale',
		value: function getScale(elementId) {
			var element = document.getElementById(elementId),
			    style = window.getComputedStyle(element, null),
			    transform = style.getPropertyValue("-webkit-transform") || style.getPropertyValue("-moz-transform") || style.getPropertyValue("-ms-transform") || style.getPropertyValue("-o-transform") || style.getPropertyValue("transform") || "fail...";

			// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

			var values = transform.split('(')[1];
			values = values.split(')')[0];
			values = values.split(',');
			var a = values[0];
			var b = values[1];
			var c = values[2];
			var d = values[3];

			return Math.sqrt(a * a + b * b);
		}
	}, {
		key: 'hasClass',
		value: function hasClass(elem, className) {
			return elem.className.split(' ').indexOf(className) > -1;
		}
	}]);

	return utils;
}();

exports.default = utils;
},{}]},{},[3,4,5,6,7,8,9]);
