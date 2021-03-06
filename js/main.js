


(function (window) {

    var defaults = {
        minDate: new Date('1-1-1960'),
        maxDate: new Date('1-1-2060'),
        firstDayOfTheWeek: 1,
        dayNames: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        currentDate: new Date(),
        classes: {
            calendar: 'pr-calendar',
            navigation: 'pr-calendar__nav',
            button: 'pr-button',
            buttonText: 'pr-button__text',
            disabledButton: 'pr-button_disabled',
            title: 'pr-calendar__title',
            calendarHeader: 'pr-calendar__header',
            month: 'pr-month',
            monthHeader: 'pr-month__header',
            monthGrid: 'pr-month__grid',
            dayName: 'pr-month__day-name',
            dayTypeToday: 'pr-month__day_type_today',
            gridRow: 'pr-month__grid-row',
            background: 'pr-month__background',
            cell: 'pr-month__cell',
            cellTypeOff: 'pr-month__cell_type_off',
            content: 'pr-month__content',
            headerCell: 'pr-month__header-cell',
            day: 'pr-month__day',
            dayTypeOff: 'pr-month__day_type_off',
            dataCell: 'pr-month__data-cell'
        }
    };

    var settings = {};

    var tasks = [];


    /**
     * @constructor
     *
     * @param {DOMElement} element - элемент, в котором будет рендериться
     *
     * @options - опции, задаваемые при создании календаря
     */
    var Calendar = function (element, options) {
        this.element = element;
        for (var key in defaults) {
            settings[key] = defaults[key];
        }

        for (key in options) {
            settings[key] = options[key];
        }
        var thisCalendar = this;
        this.element.addEventListener('click', function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if(target.classList.contains('prev-button')) {
                thisCalendar.prev(); return;
            }
            if(target.classList.contains('next-button')) {
                thisCalendar.next(); return;
            }
            if(target.classList.contains('today-button')) {
                settings.currentDate = new Date();
                thisCalendar.render(); return;
            }
            if(target.classList.contains(settings.classes.day)) {
                if(!document.getElementById('day_'+event.target.dataset.date)){
                    var popup = document.createElement('div');
                    popup.textContent = 'Ваши заметки на день ' + event.target.dataset.date; //ie9- doesn't work
                    popup.style.position = 'absolute';
                    popup.style.top = event.clientY + 'px';
                    popup.style.left = event.clientX + 'px';
                    popup.id = 'day_' + event.target.dataset.date;
                    document.body.appendChild(popup);
                }
            }
        });

        return this;
    };


    /**
    * @public
    *
    * @return {Object}
    */
    Calendar.prototype.render = function () {
        var data = this._getMonthData(settings.currentDate, settings.firstDayOfTheWeek);
            this.element.innerHtml = '';
        var table = this._buildTable(data);
        while (this.element.lastChild) {
            this.element.removeChild(this.element.lastChild);
        }
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
            if (day === 0) { return 7; }
            return day;
        }
        if (firstDayOfTheWeek !== 0 && firstDayOfTheWeek != 1)
            throw new Error("Incorrect firstDayOfTheWeek");
        if (firstDayOfTheWeek == 1) {
            firstDayOfTheWeek = 0;
        } else {
            firstDayOfTheWeek = 1;
        }
        var firstMonthDay = (new Date(date.getFullYear(), date.getMonth(), 0 + firstDayOfTheWeek)).getDay();
        var lastMonthDay = (new Date(date.getFullYear(), date.getMonth() + 1, 0 + firstDayOfTheWeek)).getDay();
        var daysInMonth = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
        var used = firstMonthDay + (7 - counterDays(lastMonthDay)) + daysInMonth;
        return Math.ceil(used / 7);
    };

    Calendar.prototype.next = function(){
        settings.currentDate.setMonth(settings.currentDate.getMonth() + 1);
        this.render();
    };

    Calendar.prototype.prev = function(){
        settings.currentDate.setMonth(settings.currentDate.getMonth() - 1);
        this.render();
    };


    Calendar.prototype._getMonthData = function (date, firstDayOfTheWeek) {
        var weeks = this._getWeeksInMonth(date, firstDayOfTheWeek);
        var result = [];
        var initMonth = date.getMonth();
        var currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
        var _s = currentDate.getDay();
        if(currentDate.getDay() == 0 && firstDayOfTheWeek == 0) {
            _s = 0;
        }
        else if(currentDate.getDay() == 0 && firstDayOfTheWeek == 1) {
            _s = 7;
        }
        currentDate.setDate(currentDate.getDate() - _s + firstDayOfTheWeek);

        for (var i = 0; i <  weeks; i++) {
            var week = [];
            for (var x = 0; x < 7; x++) {
                week.push({
                    day: currentDate.getDate(),
                    isCurrentMonth: currentDate.getMonth()==initMonth,
                    date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            result.push(week);
        }
        return result;
    };


    /**
     * TASKS
     */

    Calendar.prototype.getTasks = function () {
        return tasks;
    };

    /**
     * Добавляет таск в список tasks
     *
     * @param {Object} task
     * @param {Date} task.startDate - дата начала задачи
     * @param {Date} task.endDate - дата конца задачи
     * @param {Number} task.priority - приоритет задачи
     * @param {String} task.name - title of the task
     */
    Calendar.prototype.addTask = function (task) {
        tasks.push(task);
        return tasks;
    };


    Calendar.prototype.removeTask = function (task) {
        for (var i = 0, length = tasks.length; i < length; i++) {
            if (task === tasks[i]) {
                tasks.splice(i, 1);
                return tasks;
            }
        }
    };

    /**
    * Возвращает неделю следующего месяца
    * @param date
    * @returns {Array}
    */
    function getFirstWeekNextMonth(date){
        var _d = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        var lastWeek = [];
        for(var i = dayNumber(_d); i == dayNumber(_d); i++) {
            lastWeek.push(addDay(_d.getDate(), false, new Date(_d.getFullYear(), _d.getMonth(), _d.getDate())));
            _d.setDate(_d.getDate() + 1);
        }
        return lastWeek;
    }

    function changeText(elem, changeVal) {
        if (elem.textContent && (typeof (elem.textContent) != "undefined")) {
            elem.textContent = changeVal;
        } else {
            elem.innerText = changeVal;
        }
    }



    Calendar.prototype._buildTable = function (data) {
        function createEl (tagName, className, text) {
            var el = document.createElement(tagName);
            el.className = className || '';
            if (text) {
            el.innerHTML = text;
            }
            return el;
        }

        var today = new Date();
        var container, calendarHeader, month;

        container = createEl('div', settings.classes.calendar);
        calendarHeader = createEl('div', settings.classes.calendarHeader);
        month = createEl('div', settings.classes.month);
        container.appendChild(calendarHeader);
        container.appendChild(month);

        var navigation, prevButton, nextButton, title, todayButton;
        navigation = createEl('div', settings.classes.navigation);
        calendarHeader.appendChild(navigation);

        var todayButtonClass = (today.getMonth() == data[1][0].date.getMonth()
            && today.getFullYear() == data[1][0].date.getFullYear())
            ? settings.classes.button + ' ' + settings.classes.disabledButton
            : settings.classes.button;

        todayButton = navigation
            .appendChild(createEl('button', todayButtonClass))
            .appendChild(createEl('span', settings.classes.buttonText, "Сегодня"));
        todayButton.classList.add('today-button');
        todayButton.parentNode.classList.add('today-button');
        prevButton = navigation
            .appendChild(createEl('button', settings.classes.button))
            .appendChild(createEl('span', settings.classes.buttonText, "←"));
        prevButton.classList.add('prev-button');
        prevButton.parentNode.classList.add('prev-button');
        nextButton = navigation
            .appendChild(createEl('button', settings.classes.button))
            .appendChild(createEl('span', settings.classes.buttonText, "→"));
        nextButton.classList.add('next-button');
        nextButton.parentNode.classList.add('next-button');
        title = navigation
            .appendChild(createEl('div', settings.classes.title))
            .appendChild(document.createTextNode(settings.monthNames[data[2][0].date.getMonth()] + ' ' + data[0][0].date.getFullYear()));

        var monthHeaderTr, monthGrid;
        monthHeaderTr = createEl('table', settings.classes.monthHeader)
            .appendChild(createEl('tbody'))
            .appendChild(createEl('tr'));
        monthGrid = createEl('div', settings.classes.monthGrid);

        month.appendChild(monthHeaderTr.parentNode.parentNode);
        month.appendChild(monthGrid);

        var dayNames;
        if (settings.firstDayOfTheWeek === 0) {
            dayNames = settings.dayNames.slice();
        } else {
            dayNames = settings.dayNames.slice(1);
            dayNames.push(settings.dayNames[0]);
        }

        for (var n = 0; n < dayNames.length; n++) {
            monthHeaderTr.appendChild(createEl('th', settings.classes.dayName, dayNames[n]));
        }

        for (var i = 0, weeks = data.length; i < weeks; i++) {
            var row, bgTr, monthCnt, headTr, bodyTr;
            row = createEl('div', settings.classes.gridRow);
            bgTr = createEl('table', settings.classes.background)
                .appendChild(createEl('tbody'))
                .appendChild(createEl('tr'));

            monthCnt = createEl('table', settings.classes.content);

            headTr = createEl('thead')
                .appendChild(createEl('tr'));

            bodyTr = createEl('tbody')
                .appendChild(createEl('tr'));

            row.appendChild(bgTr.parentNode.parentNode);
            row.appendChild(monthCnt);
            monthCnt.appendChild(headTr.parentNode);
            monthCnt.appendChild(bodyTr.parentNode);

            for (var x = 0, days = dayNames.length; x < days; x++) {
                var day = data[i][x];
                // month__bg
                var bgClass = day.isCurrentMonth
                    ? settings.classes.cell
                    : settings.classes.cell + " " + settings.classes.cellTypeOff;
                bgTr.appendChild(createEl('td', bgClass));

                // thead
                var aClass = day.isCurrentMonth
                    ? settings.classes.day
                    : settings.classes.day + " " + settings.classes.dayTypeOff;
                    if (day.date.toDateString() == today.toDateString()) {
                        aClass += " " + settings.classes.dayTypeToday;
                    }

                var a = createEl('th', settings.classes.headerCell)
                    .appendChild(createEl('a', aClass, day.day));

                a.setAttribute('data-date', day.day);
                headTr.appendChild(a.parentNode);

                // tbody
                bodyTr.appendChild(createEl('td', settings.classes.dataCell));
            }

            monthGrid.appendChild(row);

        }

        return container;

    };

    /**
    * Таски
    * @param start - время начала действия таска
    * @param end - время истечения работы таска
    * @param taskText - текст
    * @param typeOfCallback - тип оповощения
    * @param status - статус таска(Новый, Выполненный, Отложенный и так далее).
    * @constructor
    */
    var Task = function(start, end, taskText, status, typeOfCallback){
        this.startDate = start;
        this.endDate = end;
        this.text = taskText;
        //this.status = ...
        this.typeOfCallback = typeOfCallback;
    };



    window.Calendar = Calendar;

    if (typeof exports != 'undefined') {
        exports = {
            Calendar: Calendar
        };
    }

})(this);

