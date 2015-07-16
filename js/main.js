;(function (window){
	var d = new Date(2012, 3);
	alert(d);

	var defaults = {
		minDate: new Date('1-1-1960'),
		maxDate: new Date('1-1-2060')
	};



	/**
	 * @constructor
	 * 
	 * @param {DOMElement} element - элемент, в котором будет рендериться 
	 *                               календарь
	 */
	var Calendar = function (element) {
		this.element = element;
	};
	/**
	 *
	 * @param data
	 * @returns {Array}
	 *
	 */

	Calendar.prototype.renderMonth = function(data){
		function addDay(_day, _isCurrentMonth, _date){
			return {day: _day, isCurrentMonth: _isCurrentMonth, date: _date};
		}
		var month = data.getMonth();
		var year = data.getYear();
		data = new Date(year, month, 1);
		var results = [];
		while(data.getMonth() == month){
			var day = data.getDate();
			var dayInfo = [addDay(day, true, new Date(year, month, day))];
			results.push(dayInfo);
			data.setDate(data.getDate() + 1);
		}
		return results;
	};




	/**
	 * @public
	 * 
	 * @return {Object} options - опции, с которыми будет рендериться календарь
	 */
	Calendar.prototype.render = function (options) {
		// TODO: Объединять defaults и options
	};

})(window);