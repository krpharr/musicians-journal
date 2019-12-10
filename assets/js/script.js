var year = moment().year();
var month = moment().month();
var date = moment().date();
var eventArray = [];

$("#year").text(year);
$("#month").text(month);
$("#date").text(date);
$("#time").text(moment().hour() + ":" + moment().min());



init();

test();

function init() {
    buildTimeLine();
}

function test() {

    var testMoment = moment("2019-12-10T01:00:00-05:00");

    console.log("test moment:\t" + testMoment);
    console.log("test month:\t" + testMoment.month());
    console.log("test date:\t" + testMoment.date());
    console.log("test hour:\t" + testMoment.hour());
    console.log("test minute:\t" + testMoment.minute());

    var e0 = new myEvent;
    var e1 = new myEvent;
    var e2 = new myEvent;
    var e3 = new myEvent;
    var e4 = new myEvent;

    e0.set("bass", "upright", "green", "2019-12-09T13:00:00-05:00", "2019-12-09T14:00:00-05:00", "3 hours");
    e1.set("bootcamp", "ajax", "red", "2019-12-10T13:00:00-05:00", "2019-12-10T14:00:00-05:00", "3 hours");
    e2.set("code", "homework", "blue", "2019-12-10T11:00:00-05:00", "2019-12-10T12:00:00-05:00", "");
    e3.set("bass", "upright", "green", "2019-12-11T13:00:00-05:00", "2019-12-11T14:00:00-05:00", "3 hours");
    e4.set("class", "upright", "green", "2019-12-10T15:10:00-05:00", "2019-12-10T16:55:00-05:00", "3 hours");

    var ea = [e0, e1, e2, e3, e4];
    var ls = getLocalStorage();
    console.log(ls);
    setLocalStorage(ea);
    ls = getLocalStorage();
    console.log(ls);

    // displayEvent(e1);

    var events = getEventsByDate(testMoment, ea);
    console.log("**********")
    console.log(events);

    events.forEach(event => {
        displayEvent(event);
    });
}

// created: "",
// updated: "",
// summary: "",
// description: "",
// colorId: "",
// start: "",
// end: "",
// duration: "",
// type: "",
// origin: "",
// destination: "",
// mileage: "",
// rate: "",
// pay: "",

function myEvent() {

    this.summary = "";
    this.description = "";
    this.colorId = "";
    this.start = "";
    this.end = "";
    this.duration = "";

    this.set = function(summary = "", description = "", colorId = "", start = "", end = "", duration = "") {
        this.summary = summary;
        this.description = description;
        this.colorId = colorId;
        this.start = start;
        this.end = end;
        this.duration = duration;
    };

};

function getLocalStorage() {
    //returns array of events from local Storage if exists otherwise returns null
    var lsData = JSON.parse(localStorage.getItem("musicians-journal"));
    // var eventArray = [];
    // lsData.forEach(event => {

    // });
    return lsData;
}

function setLocalStorage(eventArray) {
    localStorage.setItem("musicians-journal", JSON.stringify(eventArray));
}

function getEventsByDate(dateStr, eventArray) {
    var date = moment(dateStr);
    console.log("date: " + date);
    var events = [];
    eventArray.forEach(event => {
        var eventStart = moment(event.start);
        console.log("Date: " + date);
        console.log("Event start: " + eventStart);
        console.log("date");
        console.log(date.year());
        console.log(date.month());
        console.log(date.date());
        console.log("event");
        console.log(eventStart.year());
        console.log(eventStart.month());
        console.log(eventStart.date());

        if (date.year() === eventStart.year() && date.month() === eventStart.month() && date.date() === eventStart.date()) {
            events.push(event);
        }
    });

    console.log(events);
    return events;
}



function displayEvent(event) {
    // find div to attach event to 
    var divArray = $(".five-minute-block");
    console.log(divArray);
    console.log("event.start: " + event.start);
    var divEl = null;
    var startIndex = null;
    var endIndex = null;
    for (i = 0; i < divArray.length; i++) {
        if (event.start === divArray[i].getAttribute("data-time")) {
            startIndex = i;
        }
        if (event.end === divArray[i].getAttribute("data-time")) {
            endIndex = i;
        }
    }
    console.log("index");
    console.log(startIndex);
    // create div to attach
    if (startIndex === null) {
        return;
    }

    console.log("div !== null");
    var eventDiv = $("<div>");

    eventDiv.addClass("event position-absolute");
    console.log(eventDiv);
    console.log(event.summary);
    eventDiv.text(event.summary);
    var top = divArray[startIndex].offsetTop;
    var width = divArray[startIndex].offsetWidth;
    var width = width - 48;
    var height = divArray[endIndex].offsetTop - top;
    // eventDiv.attr("left", divArray[index].offsetLeft + "px");
    // eventDiv.attr("top", divArray[index].offsetTop + "px");
    var str = "top:" + top + "px;left:64px;width:" + width + "px;height:" + height + "px;";
    eventDiv.attr("style", str);

    // divEl.append(eventDiv);
    console.log(divArray[startIndex].offsetTop);
    console.log(divArray[startIndex].offsetLeft);
    console.log(divArray[startIndex].offsetWidth);

    divArray[startIndex].setAttribute("background-color", "green");

    $("#itenerary-view-ID").append(eventDiv);

}

function buildTimeLine() {
    var hour = 9;
    var minute = 0;
    for (var i = 0; i < 8; i++) { //hour loop
        console.log("i: " + i);
        for (var j = 0; j < 12; j++) { //5 min block loop
            var div = $("<div>");
            var p = $("<p>");
            var m = moment().month(month).date(date).hour(hour + i).minute(j * 5).seconds(0);
            div.attr("data-time", m.format());
            if (j % 6 === 0) {
                p.text(m.format('h:mm a'));
                div.append(p);
                if (j % 12 === 0) {
                    div.addClass("five-minute-block hour-block");
                } else {

                    div.addClass("five-minute-block thirty-minute-block");
                }
            } else {
                div.addClass("five-minute-block");
            }
            $("#itenerary-view-ID").append(div);
        }
    }
}

var span = $("<span>");

var now = moment();
var when = moment().add(7, 'days').subtract(1, 'months').year(2009).hours(0).minutes(0).seconds(0);
// var now = moment("12-25-1995", "MM-DD-YYYY");

console.log(now);
console.log(now._d);
// span.text(now._d);
// span.text(now);
span.text(when);
$("#right-now").append(span);

console.log(moment().date(Number));
console.log(moment().date()); // Number
console.log(moment().hour(Number));
console.log(moment().minute(Number));
console.log(moment().hour()); // Number

var start = moment({
    year: 2019,
    month: 11,
    day: 7,
    hour: 15,
    minute: 10
});

var hour = moment.duration(1, 'hours');

var halfhour = moment.duration(30, 'minutes');

var div = $("<div>");

var startSpan = $("<p>");
startSpan.text(start);
div.append(startSpan);

var halfHourSpan = $("<p>");
halfHourSpan.text(start.add(halfhour));
div.append(halfHourSpan);

var hourSpan = $("<p>");
hourSpan.text(start.add(hour));

div.append(hourSpan);

$("#test-display").append(div);


console.log("hour: " + hour);
var hourFromNow = now.add(hour);
console.log(hourFromNow);

var ul = $("<ul>");

for (var i = -7; i < 7; i++) {
    var li = $("<li>");
    var storedDate = moment().day(i);
    console.log(storedDate.isBefore(now));
    storedDate.isBefore(now) ? li.attr("style", "color:grey") : li.attr("style", "color:green");
    li.text(storedDate);
    ul.append(li);
}

$("#test-display").append(ul);