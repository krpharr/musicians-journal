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
    buildSelectMinInputs();
}

function test() {

    var testMoment = moment("2019-12-11T01:00:00-05:00");

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

    e0.set("bass", "upright", "green", "2019-12-11T09:00:00-05:00", "2019-12-11T09:30:00-05:00", "");
    e1.set("bootcamp", "ajax", "red", "2019-12-11T09:45:00-05:00", "2019-12-11T12:50:00-05:00", "");
    e2.set("code", "homework", "blue", "2019-12-10T11:00:00-05:00", "2019-12-10T12:00:00-05:00", "");
    e3.set("bass", "upright", "green", "2019-12-11T13:00:00-05:00", "2019-12-11T14:00:00-05:00", "");
    e4.set("class", "upright", "green", "2019-12-10T15:10:00-05:00", "2019-12-10T16:55:00-05:00", "");

    var ea = [e0, e1, e2, e3, e4];
    console.log(ea);
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
    this.dataID = "";
    this.summary = "";
    this.description = "";
    this.colorId = "";
    this.start = "";
    this.end = "";
    this.duration = "";

    this.set = function(summary = "", description = "", colorId = "", start = "", end = "", duration = "") {
        this.dataID = Math.random().toString(36).substr(2, 16);
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
    var events = [];
    eventArray.forEach(event => {
        var eventStart = moment(event.start);
        if (date.year() === eventStart.year() && date.month() === eventStart.month() && date.date() === eventStart.date()) {
            events.push(event);
        }
    });
    return events;
}

function displayEvent(event) {
    // find div to attach event to 
    var divArray = $(".five-minute-block");
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
    if (startIndex === null) {
        return;
    }
    var eventDiv = $("<div>");
    eventDiv.addClass("event position-absolute");
    eventDiv.attr("data-id", event.dataID);
    eventDiv.text(event.summary);
    var top = divArray[startIndex].offsetTop;
    var width = divArray[startIndex].offsetWidth;
    var width = width - 48;
    var height = divArray[endIndex].offsetTop - top;
    var str = "top:" + top + "px;left:64px;width:" + width + "px;height:" + height + "px;background-color:" + event.colorId + ";";
    eventDiv.attr("style", str);
    $("#itenerary-view-ID").append(eventDiv);

}

function buildTimeLine() {
    var hour = 9;
    var minute = 0;
    for (var i = 0; i < 8; i++) { //hour loop
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

function buildSelectMinInputs() {

    // var rArray = $(".min-select");
    // console.log("#############")
    // console.log(rArray);
    // rArray.forEach(function(r) {
    //     console.log(r);
    // });
    // console.log(a);
    console.log("buildSelectMinInputs");
    $(".min-select").each(function() {
        console.log(this);
        console.log($(this).attr("id"));
        var id = "#" + $(this).attr("id");
        buildMinSelectInputByID(id);
    });

}

function buildMinSelectInputByID(selectID) {
    // $(selectID)
    // minutesDisplay.textContent = ("0" + mins).slice(-2);
    for (var i = 0; i < 60; i += 5) {
        var str = ("0" + i).slice(-2);
        var opt = $("<option value=" + str + ">").text(str);

        $(selectID).append(opt);
    }
}

function getEventByID(id) {
    eventArray = getLocalStorage();
    var rArray = eventArray.filter(function(event) {
        return event.dataID === id;
    });
    return rArray[0];
}

function setTimeSelectorsToMomentByID(time, id) {
    var m = moment(time);
    var hour = m.hour();
    var ampm = "";
    hour >= 12 ? ampm = "pm" : ampm = "am";
    if (hour > 12) {
        hour -= 12;
    }
    var hour = ("0" + hour).slice(-2);
    var min = ("0" + m.minute()).slice(-2);
    // var min = m.minute();

    console.log("*********** setTimeSelectorsToMomentByID ******************")
    console.log(hour, min, ampm);
    // console.log($(id))
    // console.log($(id).children())
    selArray = $(id).children("select");
    console.log(selArray);
    console.log(typeof hour);
    $(selArray[0]).val(parseInt(hour)); // values were hard coded as integers
    $(selArray[1]).val(min);
    $(selArray[2]).val(ampm);

}

$(".event").on("click", function() {
    // set view to event-view
    //
    ////
    var event = getEventByID(this.getAttribute("data-id"));
    $("#event-summary-ID").text(event.summary);
    $("#event-start-ID").text(event.start);
    $("#event-end-ID").text(event.end);
    $("#event-duration-ID").text(event.duration);
    $("#event-description-ID").text(event.description);
    $("#event-colorId-ID").text(event.colorId);
    $("#event-edit-button-ID").attr("data-id", event.dataID);
});

$("#event-edit-button-ID").on("click", function() {
    // set view to edit-event-view
    //
    ////
    var event = getEventByID(this.getAttribute("data-id"));
    $("#event-summary-input-ID").val(event.summary);
    var str = moment(event.start).format("MM/DD/YYYY");
    $("#embed-picker").datepicker("setDate", str);
    $("#embed-picked").text(str);
    $("#event-description-input-ID").val(event.description);
    $("#event-color-select-ID").val(event.colorId);
    setTimeSelectorsToMomentByID(event.start, "#start-time-selectID")
    setTimeSelectorsToMomentByID(event.end, "#end-time-selectID")
});

$("#embed-picker").datepicker({
    onSelect: function() {
        $("#embed-picked").text($(this).val());
    }


});




//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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