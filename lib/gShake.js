(function($) {

    var settings = {
	'sensibility':  20,
	'timeout': 0    
    };
    
    var coords = {
	'x': null,
	'y': null,
	'z': null
    };
    
    var lastTime = new Date();

    var methods = {
	init: function(options) {
	    alert("plugin started");
	    //alert(methods.test());

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

	shakeEventDidOcurr: function() {
	    alert ("shaked!");
	},

	stop: function() {
	    
	},

	devicemotion: function(e) {
	    var current = e.accelerationIncludingGravity;

	    if((this.lastX !== null) || (this.lastY !== null) || (this.lastZ !== null)) {

		var deltaX = Math.abs(this.lastX - current.x),
		deltaY = Math.abs(this.lastY - current.y),
		deltaZ = Math.abs(this.lastZ - current.z);
		
		if(((deltaX > this.threshold) && (deltaY > this.threshold)) || 
		   ((deltaX > this.threshold) && (deltaZ > this.threshold)) || 
		   ((deltaY > this.threshold) && (deltaZ > this.threshold))) {
		
		    //calculate time in milliseconds since last shake registered
		    var currentTime = new Date(),
		    timeDifference = currentTime.getTime() - this.lastTime.getTime();
		
		    if (timeDifference > 300) {
			methods.shakeEventDidOcurr();
			this.lastTime = new Date();
		    }
		}
	    }
	
	    coords.x = current.x;
	    coords.y = current.y;
	    coords.z = current.z;
	}
    };
    
    $.fn.gShake = function(method) {

	if (methods[method]) {
	    return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	} else if  (typeof method === 'object' || ! method) {
	    return methods.init.apply(this, arguments);
	}
	else {
	    $.error('Method ' + method + ' does not exist on jQuery.gShake');
	}

    };
})(jQuery);