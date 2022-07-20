// projet dataviz
// key NASA Api : ERBNcbwVFS3Fpc1b2eAyhwKb97srt7C0Zyu94A3s

let bounds = new L.LatLngBounds(new L.LatLng(49.5, -11.3), new L.LatLng(61.2, 2.5));
// set the map with leaflet
let map = L.map('map',{
    zoomSnap:0.1,
}).setView([0, 0], 1.6);

// set the tile openstreetmap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1.6,
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

// let maxBounds = map.getBounds();
// let northEBounds = maxBounds._northEast;
// let latBounds = northEBounds.lat;
// let lonBounds = northEBounds.lng;
// console.log(latBounds+" - "+lonBounds);

let latlngs = [], latlngs2 = [];
let issIcon = L.icon({
    iconUrl:'./img-icon/iss.png',
    iconSize:[33, 30] // size of the icon => width/height
});
let marker = L.marker([48.856614, 2.3522219], { icon: issIcon });

async function callIss() {
    let response = await fetch('http://api.open-notify.org/iss-now.json');
    if (response.ok) { // if HTTP-status is 200-299
        // get the response body and parse it => json object
        map.removeLayer(marker);
        let json = await response.json();
        let lat = json.iss_position.latitude;
        let lon = json.iss_position.longitude;

        // geolocalize iss with lat and long and the icon
        marker = L.marker([lat,lon],{icon: issIcon});
        map.addLayer(marker);

        // compare iss's lon with map's lon to avoid the red line back
        if (lon<180 & lon>=0) {
            //console.log("dans les plus");
            latlngs.push([lat,lon]);
            // create a red polyline from an array of LatLng points => for the trajectory
            L.polyline(latlngs,{color:'red'}).addTo(map);
        } else if (lon<0){
            //console.log("dans les moins");
            latlngs2.push([lat,lon]);
            L.polyline(latlngs2,{color:'red'}).addTo(map);
        }
        setTimeout(callIss,5000);
    } else {
        alert("HTTP-Error: "+response.status);
    }
}
callIss();

// API APOD de la NASA
let inputUser = prompt("entrez une date");
let req = new XMLHttpRequest();
let url = `https://api.nasa.gov/planetary/apod?date=${inputUser}&api_key=`;
//let url = "https://api.nasa.gov/planetary/apod?start_date=2022-06-20&end_date=2022-07-20&api_key=";
let api_key = "5B6oJsSCQyekXZvNOKpsUhRPl1e7FHqjIAyHpybk";

req.open("GET", url + api_key);
req.send();

req.addEventListener("load", function () {
  if (req.status == 200 && req.readyState == 4) {
    let response = JSON.parse(req.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }
});
