// Location
window.lat = 21.005839;
window.lng = 105.8421251;
var map;
var mark;
var lineCoords = [];
var markers = [];
var newnum;
//data received frome thingsboard
var receivedDataDevice2;
var data;

//sensor position
const sensorGPS = [
    {lat: 21.0066095, lng: 105.8431323},
    {lat: 21.0065419, lng: 105.8432735},
    {lat: 21.0064809, lng: 105.8431522},
    {lat: 21.0065144, lng: 105.8429997}
];


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
            map
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
    var entityId
    if (num == 0){
        entityId = '23f06860-dd67-11eb-bb75-a1672e109977'
        const device = new Promise((resolve, reject)=>{
            var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
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
        device.then(res => {
            $('#key1').text(`Dust: ${res.Dust1[0][1]}`)
            $('#key2').text(`Humidity: ${res.Humidity1[0][1]}`)
            $('#key3').text(`Pressure: ${res.Pressure1[0][1]}`)
            $('#key4').text(`Temperature: ${res.Temperature1[0][1]}`)
            console.log("ok")
        })
        .catch(err => {
            console.log(err)
        })
    }
    if (num == 1){
        entityId = '21905a70-de3a-11eb-bb75-a1672e109977'
        const device = new Promise((resolve, reject)=>{
            var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
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
        device.then(res => {
            $('#key1').text(`Dust: ${res.Dust2[0][1]}`)
            $('#key2').text(`Humidity: ${res.Humidity2[0][1]}`)
            $('#key3').text(`Pressure: ${res.Pressure2[0][1]}`)
            $('#key4').text(`Temperature: ${res.Temperature2[0][1]}`)
            console.log("ok")
        })
        .catch(err => {
            console.log(err)
        })
    }
    if (num == 2){
        entityId = '64f8f9c0-de3a-11eb-bb75-a1672e109977'
        const device = new Promise((resolve, reject)=>{
            var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
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
        device.then(res => {
            $('#key1').text(`Dust: ${res.Dust3[0][1]}`)
            $('#key2').text(`Humidity: ${res.Humidity3[0][1]}`)
            $('#key3').text(`Pressure: ${res.Pressure3[0][1]}`)
            $('#key4').text(`Temperature: ${res.Temperature3[0][1]}`)
            console.log("ok")
        })
        .catch(err => {
            console.log(err)
        })
    }
    if (num == 3){
        entityId = 'b5688f10-de3a-11eb-bb75-a1672e109977'
        const device = new Promise((resolve, reject)=>{
            var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
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
        device.then(res => {
            $('#key1').text(`Dust: ${res.Dust4[0][1]}`)
            $('#key2').text(`Humidity: ${res.Humidity4[0][1]}`)
            $('#key3').text(`Pressure: ${res.Pressure4[0][1]}`)
            $('#key4').text(`Temperature: ${res.Temperature4[0][1]}`)
            console.log("ok")
        })
        .catch(err => {
            console.log(err)
        })
    }
    $('.data-sensor').show()
}

function closeData(){
    $('.data-sensor').hide()
}
// Update UAV position
setInterval(()=>{
   //function auto update drone position
var deviceGPSUAV = new Promise((resolve, reject) => {
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsaW5oLm5uMjgwMzk5QGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiYmJhYTFlNTAtZDY1My0xMWViLTkzODEtYWIyYTFhOGRhYWYwIiwiZmlyc3ROYW1lIjoiTmd1eWVuIiwibGFzdE5hbWUiOiJOaGF0IExpbmgiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiJiYTgyOGU0MC1kNjUzLTExZWItOTM4MS1hYjJhMWE4ZGFhZjAiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQ4ODI0OTEsImV4cCI6MTYyNjY4MjQ5MX0.U39ncfK0FsmJMfzxZ1pLWvHC9fFbtV9w-iOYlIC7S2HYL9lf1Wsq3YESs80cOI1hp6goZ1vmBcPj-bIxL45wrQ";
    var entityId = "e526c210-dd65-11eb-bb75-a1672e109977";
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
        resolve(GPS)
    };
    webSocket.onclose = function (event) {
        console.log("Connection is closed!");
    };
})
deviceGPSUAV.then(res=>{
    redraw(res)
    setGPS(res)
}).catch(err=>{
    console.log(err)
})
}, 1000)
