(function (window){
	

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
		var days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
		var table = document.createElement('table');
		table.appendChild(document.createElement('thead'));
		table.lastElementChild.appendChild(document.createElement('tr'));
		var HeadTr = table.lastElementChild.lastElementChild;
		
		for (var j = 0; j < 7; j++) {
			HeadTr.appendChild(document.createElement('td'));
			HeadTr.lastElementChild.appendChild(document.createTextNode(days[j]));
		};
		for (var i = 0; i < 5; i++) {
			table.appendChild(document.createElement('tr'));
			for (var j = 0; j < 7; j++) {
				table.lastElementChild.appendChild(document.createElement('td'));
			};
		};

		var initialDay = data[0][0].date.getDay();
		var dayIndex = 0;
		for (var j = initialDay; j <= 6; j++) {
			table.children[1].children[j].appendChild(document.createTextNode(data[dayIndex][0].day));
			dayIndex++;
		};

		var rowIndex = 2;
		var tr = table.children[rowIndex];
		while (dayIndex < data.length) {
			var td = tr.children[0];
			while (td && (dayIndex < data.length)) {
				td.appendChild(document.createTextNode(data[dayIndex][0].day));
				td = td.nextSibling;
				dayIndex++;
			}
			rowIndex++;
			tr = table.children[rowIndex];
		}
		return table;

	};

	var root = document.querySelector('.container');
	root.appendChild(renderMonth(new Date));

	window.Calendar = Calendar;

})(window);