


(function (window) {

	var defaults = {
		minDate: new Date('1-1-1960'),
		maxDate: new Date('1-1-2060'),
		firstDayOfTheWeek: 1,
		dayNames: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
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
		var data = this._getMonthData(settings.currentDate, settings.firstDayOfTheWeek);
		var table = this._buildTable(data);
		this.element.appendChild(table);
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




	Calendar.prototype._buildTable = function (data) {
		function createEl (tagName, className, text) {
			var el = document.createElement(tagName);
			el.className = className || '';
			if (text) {
				el.innerText = text;
			}
			return el;
		}

		var container, calendarHeader, month;

		container = createEl('div', 'calendar');
		calendarHeader = createEl('div', 'calendar__header');
		month = createEl('div', 'month');
		container.appendChild(calendarHeader);
		container.appendChild(month);

		var monthHeaderTr, monthGrid;
		monthHeaderTr = createEl('table', 'month__header')
			.appendChild(createEl('tbody'))
			.appendChild(createEl('tr'));
		monthGrid = createEl('div', 'month__grid');

		month.appendChild(monthHeaderTr.parentNode.parentNode);
		month.appendChild(monthGrid);

		var dayNames;
		if (settings.firstDayOfTheWeek === 0) {
			dayNames = settings.dayNames.slice();
		} else {
			dayNames = settings.dayNames.slice(1);
			dayNames.push(settings.dayNames[0]);
		}

		console.log(dayNames);

		for (var n = 0; n < dayNames.length; n++) {
			monthHeaderTr.appendChild(createEl('th', 'month__dayname', dayNames[n]));
		}

		for (var i = 0, weeks = data.length; i < weeks; i++) {
			var row, bgTr, monthCnt, headTr, bodyTr; 
			row = createEl('div', 'month__row');
			bgTr = createEl('table', 'month__bg')
				.appendChild(createEl('tbody'))
				.appendChild(createEl('tr'));

			monthCnt = createEl('table', 'month__cnt');

			headTr = createEl('thead')
				.appendChild(createEl('tr'));

			bodyTr = createEl('tbody')
				.appendChild(createEl('tr'));

			row.appendChild(bgTr.parentNode.parentNode);
			row.appendChild(monthCnt);
			monthCnt.appendChild(headTr.parentNode);
			monthCnt.appendChild(bodyTr.parentNode);

			for (var x = 0, days = data.length; x < days; x++) {
				var day = data[i][x];
				// month__bg
				var bgClass = day.isCurrentMonth 
					? 'month__bg-cell'
					: 'month__bg-cell month__bg-cell_type_off';
				bgTr.appendChild(createEl('td', bgClass));

				// thead
				var aClass = day.isCurrentMonth
					? 'month__cnt-day'
					: 'month__cnt-day month__cnt-day_type_off';
				var a = createEl('th', 'month__cnt-title')
					.appendChild(createEl('a', aClass, day.day));

				headTr.appendChild(a.parentNode);

				// tbody
				bodyTr.appendChild(createEl('td', 'month__cnt-item'));
			}

			monthGrid.appendChild(row);

		}

		return container;

	};

	window.Calendar = Calendar;
	
	if (typeof exports != 'undefined') {
		exports = {
			Calendar: Calendar
		};
	}

})(this);
