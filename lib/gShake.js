/*!
 * jQuery Javascript Plugin v1.0.0
 * https://github.com/GerManson/gShake
 *
 * Copyright 2011, German Rodriguez
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://en.wikipedia.org/wiki/MIT_License
 *
 * Date: Tue Aug 23 11:57:36 CDT 2011
 */

(function($) {

    var settings = {
		'sensibility':  20,
		'timeout': 0,
		callback: null,   
    };
    
    var coords = {
		'x': null,
		'y': null,
		'z': null
    };

    var lastTime = new Date();

    var methods = {
		init: function(options) {
		    return this.each(function() {
				// If options exist, lets merge them
				// with our default settings
				if (options) {
				    $.extend(settings, options);
				}
		
				if (('ondevicemotion' in window)) {
				    window.addEventListener('devicemotion', methods.devicemotion, false);
				}
		    });
		},
	
		initWithCallback: function(callback) {
			settings.callback = callback;
            methods.init.apply(this, arguments);
		},
	
		shakeEventDidOcurr: function() {
			if (typeof settings.callback === 'function') {
				settings.callback();
			}
			else {
	    		alert("shaked detected!");
			}
		},

		stop: function() {
		    if (('ondevicemotion' in window)) {
				window.removeEventListener('devicemotion', this, false);
			}

			lastTime = new Date();
			coords.x = null;
			coords.y = null;
			coords.z = null;
		},

		devicemotion: function(e) {
		    var current = e.accelerationIncludingGravity;

		    if((coords.x !== null) || (coords.y !== null) || (coords.z !== null)) {

			var deltaX = Math.abs(coords.x - current.x),
			deltaY = Math.abs(coords.y - current.y),
			deltaZ = Math.abs(coords.z - current.z);
		
			if(((deltaX > settings.sensibility) && (deltaY > settings.sensibility)) || 
			   ((deltaX > settings.sensibility) && (deltaZ > settings.sensibility)) || 
			   ((deltaY > settings.sensibility) && (deltaZ > settings.sensibility))) {
		
				    //calculate time in milliseconds since last shake registered
				    var currentTime = new Date(),
				    timeDifference = currentTime.getTime() - lastTime.getTime();
		
				    if (timeDifference > 300) {
						methods.shakeEventDidOcurr();
						lastTime = new Date();
				    }
				}
		    }
	
		    coords.x = current.x;
		    coords.y = current.y;
		    coords.z = current.z;
		}
    };
	// end methods
    
    $.fn.gShake = function(method) {
		
        if (methods[method]) {
		    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if  (typeof method === 'object' || ! method) {
		    return methods.init.apply(this, arguments);
		} else if  (typeof method === 'function') {
			return methods.initWithCallback.apply(this, arguments);
		}
		else {
		    $.error('Method ' + method + ' does not exist on jQuery.gShake');
		}

    };
})(jQuery);