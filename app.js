const travelUrl = 'http://api.sl.se/api2/TravelPlannerV3_1/trip.json?key=4fe06350c02048afa6c87ff05f364a99';
const stopUrl = 'https://api.sl.se/api2/typeahead.json?Key=b319425e93864415aef703c36e6a8f49';
var searchWord;
var myStop;
var goingStop;
var searchResults = [];
var departures = [];
var reNewInfo;
async function filterMyStop() {

    if(searchResults.length > 0) {
        if(searchWord != document.getElementById("myStop").value) {
            searchResults.length = 0;
            document.getElementById("resultsMyStop").innerHTML = "";
        }
        else {
            return;
        }
    }
    searchWord = document.getElementById("myStop").value;
  
    var url = stopUrl + "&SearchString=" + searchWord + "&stationsonly=true";
    await fetch(url,
        {
            method: 'GET', 
            mode: 'cors',
            cache: "no-cache",
            headers: {
                "Origin": "sl.se",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*" }
        })
        .then((resp) => {
            return resp.json();
        })
        .then(function (data) {
            searchResults = data.ResponseData;
        })
        .catch(function (error) {
            console.log(error);
        });

    for (let i = 0; i < searchResults.length; i++) {
        var tag = document.createElement("a");
        tag.Name = i;
        tag.onclick = () => MyStopClick(searchResults[i]);
        tag.innerHTML = searchResults[i].Name;
        
        var element = document.getElementById("resultsMyStop");
        element.appendChild(tag);
    }
}

function MyStopClick(station) {
    myStop = station;

    searchResults.length = 0;
    document.getElementById("resultsMyStop").innerHTML = "";
    document.getElementById("myStop").value = myStop.Name;
    searchWord = null;
}

async function filterGoingTo() {

    if(searchResults.length > 0) {
        if(searchWord != document.getElementById("goingTo").value) {
            searchResults.length = 0;
            document.getElementById("resultsGoingTo").innerHTML = "";
        }
        else {
            return;
        }
    }
    searchWord = document.getElementById("goingTo").value;
  
    var url = stopUrl + "&SearchString=" + searchWord + "&stationsonly=true";
    await fetch(url,
        {
            method: 'GET', 
            mode: 'cors',
            cache: "no-cache",
            headers: {
                "Origin": "sl.se",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*" }
        })
        .then((resp) => {
            return resp.json();
        })
        .then(function (data) {
            searchResults = data.ResponseData;
        })
        .catch(function (error) {
            console.log(error);
        });

    for (let i = 0; i < searchResults.length; i++) {
        var tag = document.createElement("a");
        tag.Name = i;
        tag.onclick = () => GoingToClick(searchResults[i]);
        tag.innerHTML = searchResults[i].Name;
        
        var element = document.getElementById("resultsGoingTo");
        element.appendChild(tag);
    }
}

function GoingToClick(station) {
    goingStop = station;

    searchResults.length = 0;
    document.getElementById("resultsGoingTo").innerHTML = "";
    document.getElementById("goingTo").value = goingStop.Name;
    searchWord = null;
}

async function GetTravelInfoClick() {

    document.getElementById("myStopHeader").innerHTML = myStop.Name;

    var url = travelUrl + "&originExtId=" + myStop.SiteId + "&destExtId=" + goingStop.SiteId;
    await fetch(url,
        {
            method: 'GET', 
            mode: 'cors',
            cache: "no-cache",
            headers: {
                "Origin": "sl.se",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*" }
        })
        .then((resp) => {
            console.log(resp);
            return resp.json();
        })
        .then(function (data) {
            departures = data.Trip;
            console.log(departures);
        })
        .catch(function (error) {
            console.log(error);
        });

    var perrow = 2;
    html = "<table><tr>";
    for (let i = 0; i < departures.length; i++) {
        const departure = departures[i];
        const legList = departure['LegList'];
        const leg = legList['Leg'];
        const firstTransport = leg[0];
        const departureDate = firstTransport['Origin'].date;
        const departureTime = firstTransport['Origin'].time;
        var today = new Date();
        const departureDateAndTime = new Date(`${departureDate}T${departureTime}`);
        const diff = Math.abs(departureDateAndTime - today); 
        let minToDeparture = Math.floor((diff/1000)/60);
        var walkDistance = document.getElementById("walkDistance").value;

        if(walkDistance > 0)
        {
            minToDeparture += parseInt(walkDistance);
        }

        html += `<td>${firstTransport.name} ${firstTransport.direction} ${minToDeparture} Minuter</td>`;
    
        var next = i + 1;
        if (next%perrow==0 && next!=departures.length) {
        html += "</tr><tr>"; }

    }
    html += "</tr></table>";
    
    document.getElementById("container").innerHTML = html;

    if(reNewInfo == null)
    {
        reNewInfo = setInterval(GetTravelInfoClick, 60000);
    }
}