// google calendar api key for varsphilos
// AIzaSyAw4l7Jzmsi0rv9Hjjn8mWWFNIP1DS06V0

var month = moment().month();
var date = moment().date();

$("#month").text(month);
$("#date").text(date);
$("#time").text(moment().hour() + ":" + moment().min());

var hour = 9;
var minute = 0;
var fiveMins = moment.duration(5, "minutes");

for (var i = 0; i < 8; i++) { //hour loop
    console.log("i: " + i);
    for (var j = 0; j < 12; j++) { //5 min block loop
        var div = $("<div>");
        var p = $("<p>");
        var m = moment().month(month).date(date).hour(hour + i).minute(j * 5);
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


console.log("hour: " + hour)
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



// Client ID and API key from the Developer Console
var CLIENT_ID = '619279516895-4cqkn60nbmsmo23eegg6hlj9ipvag0mq.apps.googleusercontent.com';
var API_KEY = 'AIzaSyAw4l7Jzmsi0rv9Hjjn8mWWFNIP1DS06V0';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                console.log(event);
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}