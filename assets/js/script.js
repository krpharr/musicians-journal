var year = moment().year();
var month = moment().month();
var date = moment().date();
var eventArray = [];

var containerArray = ["#main-ID", "#view-ID", "#edit-ID"];

$("#year").text(year);
$("#month").text(month);
$("#date").text(date);
$("#time").text(moment().hour() + ":" + moment().min());

init();

// test();

function init() {
    buildTimeLine();
    buildSelectMinInputs();
    var str = moment().format("MM/DD/YYYY");
    $("#embed-picker").datepicker("setDate", str);
    $("#embed-picked").text(str);

    var m = moment("2019-12-13T09:00:00-05:00");
    // var m = moment();
    // var roundUp = m.minute() || m.second() || m.millisecond() ? m.add(1, 'hour').startOf('hour') : m.startOf('hour');
    // start = start.hour();
    // var end = m.add(1, 'hour');
    // console.log(m, end);
    setTimeSelectorsToMomentByID(m, "#start-time-selectID");
    setTimeSelectorsToMomentByID(m.add(1, 'hour'), "#end-time-selectID");


    var ls = getLocalStorage();
    console.log(ls);

    // ls = getLocalStorage();
    // console.log(ls);

    // displayEvent(e1);
    if (ls !== null) {
        var events = getEventsByDate(m, ls);
        if (events.length > 0) {
            console.log("**********")
            console.log(events);
            events.forEach(event => {
                displayEvent(event);
            });

        }
    }





    setFocus("#main-ID");
}

function test() {

    var testMoment = moment("2019-12-12T01:00:00-05:00");

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

    e0.set("", "bass", "upright", "yellow", "2019-12-12T09:00:00-05:00", "2019-12-12T09:30:00-05:00");
    e1.set("", "bootcamp", "ajax", "red", "2019-12-12T09:45:00-05:00", "2019-12-12T12:50:00-05:00");
    e2.set("", "code", "homework", "blue", "2019-12-12T13:10:00-05:00", "2019-12-12T13:35:00-05:00");
    e3.set("", "bass", "upright", "green", "2019-12-12T15:15:00-05:00", "2019-12-12T15:30:00-05:00");
    e4.set("", "class", "upright", "purple", "2019-12-12T16:25:00-05:00", "2019-12-12T16:55:00-05:00");

    var ea = [e0, e1, e2, e3, e4];
    console.log(ea);
    // setLocalStorage(ea);
    var ls = getLocalStorage();
    console.log(ls);

    // ls = getLocalStorage();
    // console.log(ls);

    // displayEvent(e1);

    var events = getEventsByDate(testMoment, ls);
    console.log("**********")
    console.log(events);

    events.forEach(event => {
        displayEvent(event);
    });
}

function myEvent() {
    this.dataID = "";
    this.summary = "";
    this.description = "";
    this.colorId = "";
    this.start = "";
    this.end = "";

    this.set = function(dataID = "", summary = "", description = "", colorId = "", start = "", end = "") {
        this.dataID = dataID;
        if (this.dataID === "") {
            this.dataID = Math.random().toString(36).substr(2, 16);
        }
        this.summary = summary;
        this.description = description;
        this.colorId = colorId;
        this.start = start;
        this.end = end;

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
    console.log("buildSelectMinInputs");
    $(".min-select").each(function() {
        console.log(this);
        console.log($(this).attr("id"));
        var id = "#" + $(this).attr("id");
        buildMinSelectInputByID(id);
    });

}

function buildMinSelectInputByID(selectID) {
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
    var selArray = $(id).children("select");
    console.log(selArray);
    console.log(typeof hour);
    $(selArray[0]).val(parseInt(hour)); // values were hard coded as integers
    $(selArray[1]).val(min);
    $(selArray[2]).val(ampm);

}

function getMomentFromTimeSelector(id) {
    var selArray = $(id).children("select");
    var date = $("#embed-picked").text();
    var hour = parseInt($(selArray[0]).val());
    var min = $(selArray[1]).val();
    var ampm = $(selArray[2]).val();
    if (ampm === "pm") {
        if (hour < 12) {
            console.log("pm ! " + hour + "+= 12")
            hour += 12;
        }
    }
    ampm === "am" ? ampm = "A" : ampm = "P";
    date = date.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");
    // console.log(date);
    var day = moment(date);
    var m = day.hour(hour).minute(min);
    // var mTime = moment(time, "MM-DD-YYYY hh:mm " + ampm);
    // console.log(mTime);
    // var time = hour + ":" + min;
    // var m = moment(date + " " + time, "MM-DD-YYYY HH:mm " + ampm);
    return m;
}

var editFormValid = {
    title: false,
    startTime: false,
    endTime: false
}

function editFormCheck() {
    // if (formValid.title && editFormValid.startTime && editFormValid.endTime) {
    if (editFormValid.title && editFormValid.startTime && editFormValid.endTime) {
        $('#edit-event-submit-ID').removeAttr('disabled'); // Allow submitting of form
    } else {
        $('#edit-event-submit-ID').attr('disabled', true); // Block form from being submitted
    }
}

function setFocus(containerID) {
    containerArray.forEach(c => {
        console.log("*********  setFocus(container)  ***************");
        console.log("container", containerID);
        console.log("c", c);
        c === containerID ? $(c).show() : $(c).hide();
    });
}

$(".time-select").on("change", function() {
    //end-time > start-time?
    var mStart = getMomentFromTimeSelector("#start-time-selectID");
    var mEnd = getMomentFromTimeSelector("#end-time-selectID");
    console.log(mStart);
    console.log(mEnd);
    console.log(mStart < mEnd);
    if (mStart < mEnd) {
        editFormValid.startTime = true;
        editFormValid.endTime = true;
        $("#end-time-error-ID").hide();

    } else {
        editFormValid.startTime = false;
        editFormValid.endTime = false;
        $("#end-time-error-ID").text("End time must be later than start time.").show();
    }
    editFormCheck();
});

$("#event-summary-input-ID").on("input", function() {
    console.log("*********** on input event-summary-input-ID ******************");
    var str = $(this).val();
    if (str.length < 1) {
        editFormValid.title = false;
        $("#event-summary-input-error-ID").text("*").show()
    } else {
        editFormValid.title = true;
        $("#event-summary-input-error-ID").hide();
    }
    editFormCheck();
});

$(".hour-select").on("change", function() {
    var i = parseInt($(this).val());
    var ampm;
    i >= 1 && i < 6 || i === 12 ? ampm = "pm" : ampm = "am";
    var sibs = $(this).siblings();
    $(sibs[3]).val(ampm);
});


$("#event-cancel-button-ID").on("click", function() {
    // return to main-view
    setFocus("#main-ID");
});


$("#edit-event-cancel-ID").on("click", function() {
    // return to main-view
    setFocus("#main-ID");
});

$("#edit-event-delete-ID").on("click", function() {
    event.preventDefault();
    if (confirm("DELETE: Are you sure?")) {
        // delete event from local storage
        var id = $("#event-dataID-ID").attr("data-id");
        removeFromLocalStorageByID(id);
        //return tom main view
        location.reload();
        setFocus("#main-ID");
    }
});

function removeFromLocalStorageByID(id) {
    var eArray = getLocalStorage();
    if (eArray !== null) {
        var index = eArray.findIndex(function(e) {
            return e.dataID === id;
        });
        if (index !== -1) {
            eArray.splice(index, 1);
            setLocalStorage(eArray);
        }
    }


}

$("#edit-event-submit-ID").on("click", function(event) {
    event.preventDefault();
    var id = $("#event-dataID-ID").attr("data-id");
    var summary = $("#event-summary-input-ID").val();
    var description = $("#event-description-input-ID").val();
    var colorId = $("#event-color-select-ID").val();
    var start = getMomentFromTimeSelector("#start-time-selectID");
    var end = getMomentFromTimeSelector("#end-time-selectID");
    console.log(start.format(), end.format());
    var eventObj = new myEvent;
    eventObj.set(id, summary, description, colorId, start.format(), end.format());
    removeFromLocalStorageByID(id);
    var eArray = getLocalStorage();
    if (eArray === null) {
        eArray = [];
    }
    eArray.push(eventObj);
    setLocalStorage(eArray);
    //set to main-view
    location.reload();
    setFocus("#main-ID");

});

$(".event").on("click", function() {
    // set view to event-view
    setFocus("#view-ID");
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

$("#new-event-button-ID").on("click", function() {
    // initilize form
    editFormValid.startTime = true;
    editFormValid.endTime = true;
    editFormCheck();
    setFocus("#edit-ID");

});

$("#event-edit-button-ID").on("click", function() {
    // $("#event-event-view-ID").empty();
    // set view to edit-event-view
    //
    ////
    var id = $(this).attr("data-id");
    var event = getEventByID(id);
    $("#event-dataID-ID").attr("data-id", id);
    // var event = getEventByID(this.getAttribute("data-id"));
    $("#event-summary-input-ID").val(event.summary);
    var str = moment(event.start).format("MM/DD/YYYY");
    $("#embed-picker").datepicker("setDate", str);
    $("#embed-picked").text(str);
    $("#event-description-input-ID").val(event.description);
    $("#event-color-select-ID").val(event.colorId);
    setTimeSelectorsToMomentByID(event.start, "#start-time-selectID");
    setTimeSelectorsToMomentByID(event.end, "#end-time-selectID");
    editFormValid.title = true;
    editFormValid.startTime = true;
    editFormValid.endTime = true;
    editFormCheck();
    setFocus("#edit-ID");

});

$("#embed-picker").datepicker({
    onSelect: function() {
        $("#embed-picked").text($(this).val());
    }
});

//////////////////////////////////////////////////////////////////////////////