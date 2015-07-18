


(function (window) {

	var defaults = {
		minDate: new Date('1-1-1960'),
		maxDate: new Date('1-1-2060'),
		firstDayOfTheWeek: 1,
		currentDate: new Date()
	};

	var settings = {};

	/**
	 * @constructor
	 *
	 * @param {DOMElement} element - элемент, в котором будет рендериться
	 *                               календарь
	 */
	var Calendar = function (element, options) {
		this.element = element;
		for (var key in defaults) {
			settings[key] = defaults[key];
		}

		for (key in options) {
			settings[key] = options[key];
		}

		return this;
	};


	/**
	 * @public
	 * 
	 * @return {Object}
	 */
	Calendar.prototype.render = function (mode) {
		this.element.appendChild(this._renderMonth(mode));
		var data = this._getMonthData(settings.currentDate, settings.firstDayOfTheWeek);
		this._buildTable(data);
	};

	/**
	 * Возвращает число недель в месяце
	 * 
	 * @param  {Date} date
	 * @param  {0|1} firstDayOfTheWeek - первый день недели (0 - ВС, 1 - ПН)
	 * @return {Number} - число дней в месяце
	 */
	Calendar.prototype._getWeeksInMonth = function (date, firstDayOfTheWeek) {
        function counterDays (day) {
          if (day === 0) {return 7;}
          return day;
        }
		if (firstDayOfTheWeek !== 0 && firstDayOfTheWeek != 1)
			throw new Error("Incorrect firstDayOfTheWeek");
		if (firstDayOfTheWeek == 1) {
    		firstDayOfTheWeek = 0;
  		} else { firstDayOfTheWeek = 1; }
  		var firstMonthDay = (new Date(date.getFullYear(), date.getMonth(), 0 + firstDayOfTheWeek)).getDay();
  		var lastMonthDay = (new Date(date.getFullYear(), date.getMonth() + 1, 0 + firstDayOfTheWeek)).getDay();
  		var daysInMonth = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
     	var used = firstMonthDay + (7 - counterDays(lastMonthDay)) + daysInMonth;
  		return Math.ceil(used / 7);
	};



	Calendar.prototype._getMonthData = function (date, firstDayOfTheWeek) {
		//function dayNumber(date) {
		//	var day = date.getDay();
		//	if (day == 0) day = 7; //1, 2, 3, 4, 5, 6, 7
		//	return day - 1;
		//}
		//function getLastWeekPrevMonth(date){
		//	var _d = new Date(date.getFullYear(), date.getMonth(), 0);
		//	var lastWeek = [];
		//	for(var i = dayNumber(_d); i == dayNumber(_d); i--){
		//		lastWeek.push(addDay(_d.getDate(), false, new Date(_d.getFullYear(), _d.getMonth(), _d.getDate())));
		//		_d.setDate(_d.getDate() - 1);
		//	}
		//	return lastWeek;
		//}
        //
		//return lastWeek;
        var weeks = this._getWeeksInMonth(date, firstDayOfTheWeek);
        var result = [];
        var initMonth = date.getMonth();
        var currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
        var _s = currentDate.getDay();
        if(currentDate.getDay()==0 && firstDayOfTheWeek == 0){
            _s = 0;
        }
        else if(currentDate.getDay()==0&&firstDayOfTheWeek==1){
            _s = 7;
        }
        currentDate.setDate(currentDate.getDate() - _s + firstDayOfTheWeek);

        for (var i = 0; i <  weeks; i++) {
            var week = [];
            for (var x = 0; x < 7; x++) {
                week.push({
                    day: currentDate.getDate(),
                    isCurrentMonth: true ? currentDate.getMonth()==initMonth : false,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            result.push(week);
        }
        return result;
	};

	/**
	 * Возвращает неделю следующего месяца
	 * @param date
	 * @returns {Array}
	 */
	function getFirstWeekNextMonth(date){
		var _d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		var lastWeek = [];
		for(var i = dayNumber(_d); i == dayNumber(_d); i++){
			lastWeek.push(addDay(_d.getDate(), false, new Date(_d.getFullYear(), _d.getMonth(), _d.getDate())));
			_d.setDate(_d.getDate() + 1);
		}
		return lastWeek;
	}
	/**
	 * Строит таблицу по указанным данным
	 *
	 * @param  {Object} date
	 * @return {DOMElement} - таблица
	 */
	function renderMonth (date) {
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
		if(_prev.length <= 6){
			_prev.map(function(a){
				results[0].unshift(a);
			});
		}


		if(_next.length <= 6){
			_next.map(function(a){
				results[results.length - 1].push(a);
			});
		}


		return buildTable(results);
	};



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
	Calendar.prototype._buildTable = function (data) {
		var days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
		var table = document.createElement('table');
		table.appendChild(document.createElement('thead'));
		table.lastElementChild.appendChild(document.createElement('tr'));
		var HeadTr = table.lastElementChild.lastElementChild;
		
		for (var j = 0; j < days.length; j++) {
			HeadTr.appendChild(document.createElement('td'));
			HeadTr.lastElementChild.appendChild(document.createTextNode(days[j]));
		};

		for (var i = 0; i < data.length; i++) {
			table.appendChild(document.createElement('tr'));
			for (var j = 0; j < days.length; j++) {
				var curTr = table.lastElementChild;
				curTr.appendChild(document.createElement('td'));
				curTr.lastElementChild.appendChild(document.createTextNode(data[i][j].day));
				if (data[i][j].isCurrentMonth) {
					curTr.lastElementChild.classList.add('days-current-month')
				}
			};
		};
		return table;
	};

	window.Calendar = Calendar;
	
	if (typeof exports != 'undefined') {
		exports = {
			Calendar: Calendar
		};
	}

})(this);
