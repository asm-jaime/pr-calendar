;(function (window){
	
	var defaults = {
		minDate: new Date('1-1-1960'),
		maxDate: new Date('1-1-2060')
	}

	/**
	 * @constructor
	 * 
	 * @param {DOMElement} element - элемент, в котором будет рендериться 
	 *                               календарь
	 */
	var Calendar = function (element) {
		this.element = element;
	}

	/**
	 * @public
	 * 
	 * @return {Object} options - опции, с которыми будет рендериться календарь
	 */
	Calendar.prototype.render = function (options) {
		// TODO: Объединять defaults и options
	};

})(window)