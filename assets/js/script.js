var year;
var month;
var date;
var eventArray = [];
var mGlobal;
var lsDate = JSON.parse(localStorage.getItem("mj-mGlobalDate"));
if (lsDate === null) {
    mGlobal = moment().hour(9).minute(0);
} else {
    mGlobal = moment(lsDate).hour(9).minute(0);
}

var containerArray = ["#main-ID", "#view-ID", "#edit-ID"];

var max_hour = 17;



init();

// test();

function init() {
    $("#itenerary-view-ID").empty();
    localStorage.setItem("mj-mGlobalDate", JSON.stringify(mGlobal))
    year = mGlobal.year();
    month = mGlobal.month();
    date = mGlobal.date();

    $("#year").text(year);
    $("#month").text(month);
    $("#date").text(date);
    $("#time").text(moment().hour() + ":" + moment().min());


    buildTimeLine();
    buildSelectMinInputs();
    // var str = moment().format("MM/DD/YYYY");
    var str = mGlobal.format("MM/DD/YYYY");
    $("#embed-picker").datepicker("setDate", str);
    $("#embed-picked").text(str);

    // var m = moment("2019-12-13T09:00:00-05:00");
    // var m = moment().hour(9).minute(0);
    // console.log("********** init() *****************");
    // console.log(m);

    $("#main-date-ID").text(mGlobal.month() + 1 + "/" + mGlobal.date() + "/" + mGlobal.year());
    setTimeSelectorsToMomentByID(mGlobal.hour(9).minute(0), "#start-time-selectID");
    setTimeSelectorsToMomentByID(mGlobal.add(1, 'hour'), "#end-time-selectID");


    var ls = getLocalStorage();
    console.log(ls);
    if (ls !== null) {
        var events = getEventsByDate(mGlobal, ls);
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

    if (moment(event.end).hour() >= 17) {
        console.log("********* displayEvent(event) *******************");
        console.log(event.end);
        event.end = moment(event.end).hour(16).minute(55).format();
        console.log(event.end);
    }

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
    var bgcolor = event.colorId;
    console.log("******* displayEvent() *********");
    console.log(moment(event.end) < moment());

    if (moment(event.end) < moment()) {
        bgcolor = "grey";
    }
    var str = "top:" + top + "px;left:64px;width:" + width + "px;height:" + height + "px;background-color:" + bgcolor + ";";
    console.log(str);
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
            // var m = moment().month(month).date(date).hour(hour + i).minute(j * 5).seconds(0);
            var m = mGlobal.month(month).date(date).hour(hour + i).minute(j * 5).seconds(0);

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
    console.log("*********** setTimeSelectorsToMomentByID ******************")
    console.log(hour, min, ampm);
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
    var day = moment(date);
    var m = day.hour(hour).minute(min);
    return m;
}

var editFormValid = {
    title: false,
    startTime: false,
    endTime: false
}

function editFormCheck() {
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
        // init();
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

$('#edit-form-ID').on('submit', function(e) {
    // Check if the form was previously submitted
    if ($(this).hasClass('form-submitted')) {
        e.preventDefault(); // Prevent form from being submitted again

    } else {
        $(this).addClass('form-submitted'); // Add a class to identify form as being submitted already
        $('#event-summary-input-ID').attr('readonly', true); // Lock 
        $('#event-description-input-ID').attr('readonly', true); // 
        $('#edit-event-submit-ID').attr('disabled', true); // 
        // event.preventDefault();
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
        // init();
        location.reload();
        setFocus("#main-ID");
    }
});

$("#edit-event-submit-ID").on("click", function(event) {
    $('#edit-form-ID').submit();

    // event.preventDefault();
    // var id = $("#event-dataID-ID").attr("data-id");
    // var summary = $("#event-summary-input-ID").val();
    // var description = $("#event-description-input-ID").val();
    // var colorId = $("#event-color-select-ID").val();
    // var start = getMomentFromTimeSelector("#start-time-selectID");
    // var end = getMomentFromTimeSelector("#end-time-selectID");
    // console.log(start.format(), end.format());
    // var eventObj = new myEvent;
    // eventObj.set(id, summary, description, colorId, start.format(), end.format());
    // removeFromLocalStorageByID(id);
    // var eArray = getLocalStorage();
    // if (eArray === null) {
    //     eArray = [];
    // }
    // eArray.push(eventObj);
    // setLocalStorage(eArray);
    // //set to main-view
    // // init();
    // location.reload();
    // setFocus("#main-ID");

});

$(".event").on("click", function() {
    // set view to event-view
    setFocus("#view-ID");
    //
    ////
    var event = getEventByID(this.getAttribute("data-id"));
    $("#event-summary-ID").text(event.summary);

    $("#event-colorId-ID").attr("style", "background-color:" + event.colorId + ";height:24px;width:100%;");


    $(".event-date-class").attr("style", "border:" + event.colorId + " 2px solid;");

    var m = moment(event.start);
    var str = m.month() + 1 + "/" + m.date() + "/" + m.year();
    $("#event-date-ID").text(str);
    str = m.format("hh:mm a");
    $("#event-start-ID").text("Start:\t" + str);
    var m = moment(event.end);
    str = m.format("hh:mm a");
    $("#event-end-ID").text("End:\t" + str);

    $("#event-description-ID").text(event.description);

    $("#event-edit-button-ID").attr("data-id", event.dataID);
});

$("#new-event-button-ID").on("click", function() {
    editFormValid.startTime = true;
    editFormValid.endTime = true;
    editFormCheck();
    $("#edit-event-delete-ID").hide();
    setFocus("#edit-ID");


});

$("#event-edit-button-ID").on("click", function() {
    var id = $(this).attr("data-id");
    var event = getEventByID(id);
    $("#event-dataID-ID").attr("data-id", id);
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
    $("#edit-event-delete-ID").show();
    setFocus("#edit-ID");

});

$("#right-event-button-ID").on("click", function() {
    console.log(" right-event-button-ID ")
    mGlobal = mGlobal.add(1, "day");
    console.log(mGlobal);
    // init();
    localStorage.setItem("mj-mGlobalDate", JSON.stringify(mGlobal))
    location.reload();
});

$("#left-event-button-ID").on("click", function() {
    console.log(" left-event-button-ID ")
    mGlobal = mGlobal.subtract(1, "day");
    console.log(mGlobal);
    // init();
    localStorage.setItem("mj-mGlobalDate", JSON.stringify(mGlobal))
    location.reload();
});

$("#today-event-button-ID").on("click", function() {
    mGlobal = moment().hour(9).minute(0);
    localStorage.setItem("mj-mGlobalDate", JSON.stringify(mGlobal))
    location.reload();
});

$("#embed-picker").datepicker({
    onSelect: function() {
        $("#embed-picked").text($(this).val());
    }
});

//////////////////////////////////////////////////////////////////////////////