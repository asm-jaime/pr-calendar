var Calendar = require("./js/main.js").Calendar;


var asset = require("assert"),
    should = require("should");

describe('Calendar', function () {
    describe('_getWeeksInMonth', function () {
        it('should throw an error if firstDayOfTheWeek isnt 0 or 1', function () {
            (function() {
                new Calendar()._getWeeksInMonth(new Date(), 2);           
            }).should.throw();
        });

        it('should return 6 for July, 2016 if first day of week is 0', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2016-7-1'), 0), 6);
        });

        it('should return 5 for July, 2016 if first day of week is 1', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2016-7-1'), 1), 5);
        });

        it('should return 6 for August, 2015 if first day of week is 1', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2015-8-1'), 1), 6);
        });

        it('should return 6 for August, 2015 if first day of week is 0', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2015-8-1'), 0), 6);
        });

    });


    describe('_getMonthData', function () {
        it('should throw an error if firstDayOfTheWeek isnt 0 or 1', function () {
            (function () {
                new Calendar()._getMonthData(new Date(), 2);
            }).should.throw();
        });

        it('should return an array', function () {
            var results = new Calendar()._getMonthData(new Date(), 0);
            should(results).be.an.Array();
        });

        it('should return array with 6 elements in July, 2016 if the first day of week is 0', function () {
            should.equal(new Calendar()._getMonthData(new Date('2016-7-1'), 0).length, 6);
        });

        it('should return array with 5 elements in July, 2016 if the first day of week is 1', function () {
            should.equal(new Calendar()._getMonthData(new Date('2016-7-1'), 1).length, 5);
        });

        it('should contain first day of the month', function () {
            var data = new Calendar()._getMonthData(new Date('2016-2-1'), 1);
            should.equal(data[0][0].day, 23);
            should.equal(data[0][6].day, 1);
        });

        it('should return array with weeks where every week has 7 days', function () {
            var weeks = new Calendar()._getMonthData(new Date(), 0);
            for (var i = 0; i < weeks.length; i++) {
                should.equal(weeks[0].length, 7);
            }
        });

    });
});