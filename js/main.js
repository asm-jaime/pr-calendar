


;(function (window){


	var defaults = {
		minDate: new Date('1-1-1960'),
		maxDate: new Date('1-1-2060'),
		currentDate: new Date()
	};

	/**
	 * @constructor
	 *
	 * @param {DOMElement} element - элемент, в котором будет рендериться
	 *                               календарь
	 */
	var Calendar = function (element, options) {
		this.element = element;
		return this;
	};


	/**
	 * @public
	 *
	 * @return {Object}
	 */
	Calendar.prototype.render = function (mode) {
		// Метод должен вставлять в this.element
		// код таблицы в которой число строк равно
		// числу недель в месяце, а число столбцов
		// равно числу дней в неделе.
	};


	/**
	 * Рендерит таблицу для режима "месяц"
	 *
	 * @return {DOMElement} - таблица
	 */

	function renderMonth (date) {
		function addDay(_day, _isCurrentMonth, _date){
			return {day: _day, isCurrentMonth: _isCurrentMonth, date: _date};
		}

		var month = date.getMonth();
		var year = date.getFullYear();
		date = new Date(year, month, 1);
		var results = [];
		while(date.getMonth() == month){
			var day = date.getDate();
			var dayInfo = [addDay(day, true, new Date(year, month, day))];
			results.push(dayInfo);
			date.setDate(date.getDate() + 1);
		}
		return buildTable(results);
	}

	/**
	 * Строит таблицу по указанным данным
	 *
	 * @param  {Object} data
	 * @return {DOMElement} - возвращает элемент с
	 *                        таблицей
	 *
	 * @example
	 * Пример данных в data:
	 * [
	 *   [
	 *   	{ day: 29, isCurrentMonth: false, date: new Date('6-29-2015') },
	 *   	{ day: 30, isCurrentMonth: false, date: new Date('6-30-2015') },
	 *   	{ day: 1, isCurrentMonth: true, date: new Date('7-1-2015') },
	 *   	...
	 *   ],
	 *   [
	 *   	{ day: 6, isCurrentMonth: true, date: new Date('7-6-2015')}
	 *   ]
	 * ]
	 */
	function buildTable (data) {

	}

	window.Calendar = Calendar;

})(window);