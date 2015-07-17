


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
	 * Строит таблицу по указанным данным
	 *
	 * @param  {Object} date
	 * @return {DOMElement} - таблица
	 */
	function renderMonth (date) {
		function addDay(_day, _isCurrentMonth, _date){
			return {day: _day, isCurrentMonth: _isCurrentMonth, date: _date};
		}
		function dayNumber(date) {
			var day = date.getDay();
			if (day == 0) day = 7; //1, 2, 3, 4, 5, 6, 7
			return day - 1;
		}
		function getLastWeekPrevMonth(date){
			var _d = new Date(date.getFullYear(), date.getMonth(), 0);
			var lastWeek = [];
			console.log("test");
			for(var i = dayNumber(_d); i == dayNumber(_d); i--){
				lastWeek.push(addDay(_d.getDate(), false, new Date(_d.getFullYear(), _d.getMonth(), _d.getDate())));
				console.log(i, "         ", dayNumber(_d));
				_d.setDate(_d.getDate() - 1);
			}
			return lastWeek;
		}
		function getFirstWeekNextMonth(date){
			var _d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
			var lastWeek = [];
			console.log("test");
			for(var i = dayNumber(_d); i == dayNumber(_d); i++){
				lastWeek.push(addDay(_d.getDate(), false, new Date(_d.getFullYear(), _d.getMonth(), _d.getDate())));
				console.log(i, "         ", dayNumber(_d));
				_d.setDate(_d.getDate() + 1);
			}
			return lastWeek;
		}
		var _prev = getLastWeekPrevMonth(date);
		var _next = getFirstWeekNextMonth(date);
		var month = date.getMonth();
		var year = date.getFullYear();
		date = new Date(year, month, 1);
		var results = [];
		var firsttime = true;
		while(date.getMonth() == month){
			var day = date.getDate();
			if(dayNumber(date) == 0 || firsttime){
				var dayInfo = [addDay(day, true, new Date(year, month, day))];
				results.push(dayInfo);
				firsttime = false;
			}
			else{
				var dayInfo = addDay(day, true, new Date(year, month, day));
				results[results.length-1].push(dayInfo);
			}
			date.setDate(date.getDate() + 1);
		}
		_prev.map(function(a){
			results[0].unshift(a);
		});
		_next.map(function(a){
			results[results.length - 1].push(a);
		});
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

	window.Calendar = Calendar;

})(window);