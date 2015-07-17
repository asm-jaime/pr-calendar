var Calendar = require("./js/main.js").Calendar;


var asset = require("assert"),
    should = require("should");

describe('Calendar', function () {
    describe('_getWeeksInMonth', function () {
        it('should throw an error if firstDayOfTheWeek isnt 0 or 1', function () {
            (function() {
                var calendar = new Calendar();
                calendar._getWeeksInMonth(new Date(), 2);           
            }).should.throw();
        });

        it('should return 5 for July, 2016 if first day of week is 0', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2016-6-1'), 0), 5);
        });

        it('should return 6 for July, 2016 if first day of week is 1', function () {
            should.equal(new Calendar()._getWeeksInMonth(new Date('2016-6-1'), 0), 6);
        });
    });
});