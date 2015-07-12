'use strict'

var calendarHeight = function() {
	var dayNamesHeight 	= document.getElementById('day-names').offsetHeight;
	var daysRow 		= document.getElementsByClassName('days-row');
	var viewPortHeight 	= Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	var wrapPadding		= document.getElementById('table-wrapper').style.paddingTop;
	for(var i = 0; i < daysRow.length; i++) {
	    daysRow[i].style.height = (viewPortHeight - dayNamesHeight - wrapPadding) / daysRow.length + 'px';
	};
};

var windowResize = window.onresize = function(event) {
    calendarHeight();
};

calendarHeight();