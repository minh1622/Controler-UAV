// Location
window.lat = 21.005839;
window.lng = 105.8421251;
var map;
var mark;
var lineCoords = [];
var markers = [];
//data received frome thingsboard
var receivedDataDevice2;
var receivedData2;
var data;

//sensor position
const sensorGPS = [
    {lat: 21.00652027333162, lng: 105.84299587028097},
    {lat: 21.006556714156694, lng: 105.84280637179762},
    {lat: 21.006687733449493, lng: 105.84300732301932}
];

//function auto update drone position
function deviceGPSUAV() {
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
    var entityId = "ab416f70-d8b3-11eb-b87d-c1a34fc0b07b";
    var webSocket = new WebSocket("wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=" + token);
    webSocket.onopen = function () {
        var object = {
            tsSubCmds: [
                {
                    entityType: "DEVICE",
                    entityId: entityId,
                    scope: "LATEST_TELEMETRY",
                    cmdId: 10
                }
            ],
            historyCmds: [],
            attrSubCmds: []
        };
        var data = JSON.stringify(object);
        webSocket.send(data);
    };

    webSocket.onmessage = function (event) {
        var received_msg = event.data;
        var receivedData = JSON.parse(received_msg)
        lat = parseFloat(receivedData.data.Lat_UAV[0][1])
        lng = parseFloat(receivedData.data.Lon_UAV[0][1])
        var GPS = {
            lat: lat,
            lng: lng
        }
        redraw(GPS)
        setGPS(GPS)
    };
    webSocket.onclose = function (event) {
        console.log("Connection is closed!");
    };
}

const device1 = new Promise((resolve, reject)=>{
        var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
        var entityId = '8fdf2190-d8b4-11eb-9381-ab2a1a8daaf0'
        var webSocket = new WebSocket("wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=" + token);
        webSocket.onopen = function () {
            var object = {
                tsSubCmds: [
                    {
                        entityType: "DEVICE",
                        entityId: entityId,
                        scope: "LATEST_TELEMETRY",
                        cmdId: 10
                    }
                ],
                historyCmds: [],
                attrSubCmds: []
            };
            var data = JSON.stringify(object);
            webSocket.send(data);
        };
    
        webSocket.onmessage = function (event) {
            var received_msg = event.data;
            receivedDataDevice2 = JSON.parse(received_msg)
            receivedDataDevice2 = receivedDataDevice2.data
            resolve(receivedDataDevice2)
        };
        webSocket.onclose = function (event) {
            console.log("Connection is closed!");
        };
        
    }
)
const device3 = new Promise((resolve, reject)=>{
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
    var entityId = '9098fbb0-d8b4-11eb-9381-ab2a1a8daaf0'
    var webSocket = new WebSocket("wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=" + token);
    webSocket.onopen = function () {
        var object = {
            tsSubCmds: [
                {
                    entityType: "DEVICE",
                    entityId: entityId,
                    scope: "LATEST_TELEMETRY",
                    cmdId: 10
                }
            ],
            historyCmds: [],
            attrSubCmds: []
        };
        var data = JSON.stringify(object);
        webSocket.send(data);
    };

    webSocket.onmessage = function (event) {
        var received_msg = event.data;
        receivedDataDevice2 = JSON.parse(received_msg)
        receivedDataDevice2 = receivedDataDevice2.data
        resolve(receivedDataDevice2)
    };
    webSocket.onclose = function (event) {
        console.log("Connection is closed!");
    };
    
}
)
const device5 = new Promise((resolve, reject)=>{
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
    var entityId = 'ab419680-d8b3-11eb-b87d-c1a34fc0b07b'
    var webSocket = new WebSocket("wss://demo.thingsboard.io/api/ws/plugins/telemetry?token=" + token);
    webSocket.onopen = function () {
        var object = {
            tsSubCmds: [
                {
                    entityType: "DEVICE",
                    entityId: entityId,
                    scope: "LATEST_TELEMETRY",
                    cmdId: 10
                }
            ],
            historyCmds: [],
            attrSubCmds: []
        };
        var data = JSON.stringify(object);
        webSocket.send(data);
    };

    webSocket.onmessage = function (event) {
        var received_msg = event.data;
        receivedDataDevice2 = JSON.parse(received_msg)
        receivedDataDevice2 = receivedDataDevice2.data
        resolve(receivedDataDevice2)
    };
    webSocket.onclose = function (event) {
        console.log("Connection is closed!");
    };
    
}
)

// New map
var initialize = function() {
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center:{lat:lat,lng:lng},
        zoom:18
    });
    mark = new google.maps.Marker({
        position:{lat:lat, lng:lng}, 
        map:map,
        shouldFocus: false
    });
    for (let i = 0; i<sensorGPS.length; i++){
        newSensor(sensorGPS[i], i)
    }

};
window.initialize = initialize;

//Set new marker sensor
function newSensor(position, num) {
    var sensors = new google.maps.Marker({
        position: position,
        map,
    })
    const contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h4 id="firstHeading">Sensor ${num}</h4>` +
    '<div id="bodyContent">' +
    `<p>State: ON</p>` +
    "(last time update 29/6/2021)</p>" +
    "</div>" +
    "</div>";
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    sensors.addListener("click", () => {
        showAndUpdateData(num)
        infowindow.open({
            anchor: sensors,
            map,
        });
        
    });
}

// Draw map
var redraw = function(payload) {
    if(payload != null){
        lat = payload.lat;
        lng = payload.lng;
        // map.setCenter({lat:lat, lng:lng, alt:0});
        mark.setPosition({lat:lat, lng:lng, alt:0});
        lineCoords.push(new google.maps.LatLng(lat, lng));
        var lineCoordinatesPath = new google.maps.Polyline({
            path: lineCoords,
            geodesic: true,
            strokeColor: '#2E10FF'
        });
    lineCoordinatesPath.setMap(map);}
};

//set new GPS drone
function setGPS(gps){
    document.getElementById("lat").innerHTML = gps.lat;
    document.getElementById("lng").innerHTML = gps.lng;
}

// Navbar
const linkColor = document.querySelectorAll(".nav__link");
function colorLink(){
    linkColor.forEach(l => l.classList.remove("active"))
    this.classList.add("active")
}
linkColor.forEach(l => l.addEventListener("click", colorLink))

// update data sensor
function showAndUpdateData(num) {
    $('.data-sensor .pos-1').text(`Sensor number ${num}`)
    
    if (num == 0){
        device1.then(res => {
            $('#key').text(`Humidity`)
            $('#value').text(`${res.HUM[0][1]} %`)
        })
        .catch(err => {
            console.log(err)
        })
    }
    if (num == 1){
        device3.then(res => {
            $('#key').text(`Temperature`)
            $('#value').text(`${res.TEMP4[0][1]} °C`)
        })
        .catch(err => {
            console.log(err)
        })
    }
    if (num == 2) {
        device5.then(res => {
            $('#key').text(`Dust`)
            $('#value').text(`${res.DUST1[0][1]} mg/m3`)
        })
        .catch(err => {
            console.log(err)
        })
    }
    if($('.data-sensor').is(':visible')){
        $('.data-sensor').hide()
    }
    else {
        $('.data-sensor').show()
    }
}

// Update UAV position
setInterval(()=>{
    deviceGPSUAV();
}, 2000)
