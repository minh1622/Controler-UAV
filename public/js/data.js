function WebSocketAPIExample() {
    var token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbmwubGFiNDExQGdtYWlsLmNvbSIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwidXNlcklkIjoiNzlkYjhhZTAtNmEyNy0xMWU4LTk2NjUtMTMyMDYzOTIxYjExIiwiZmlyc3ROYW1lIjoibGFiIiwibGFzdE5hbWUiOiI0MTEiLCJlbmFibGVkIjp0cnVlLCJwcml2YWN5UG9saWN5QWNjZXB0ZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI3OWQ2MGNhMC02YTI3LTExZTgtOTY2NS0xMzIwNjM5MjFiMTEiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2MjQzNDk2MzgsImV4cCI6MTYyNjE0OTYzOH0.K4k6RlLvcKrXg-OKv3r6yU4NBGqkNodIJ-U7PAV2J73PbA_6Vn-8gHQhgYEokPY1lA0UZdi5fG1Q3dnYUEjZHg";
    var entityId = "1ce61eb0-d336-11eb-9381-ab2a1a8daaf0";
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
        console.log("Message is sent: " + data);
    };

    webSocket.onmessage = function (event) {
        var received_msg = event.data;
        console.log("Message is received: " + received_msg);
    };

    webSocket.onclose = function (event) {
        alert("Connection is closed!");
    };
}
setInterval(()=>{
    WebSocketAPIExample()
},3000)

// socketIO
const socketIO = io("/")
// Location
window.lat = 21.005839;
window.lng = 105.8421251;
var map;
var mark;
var lineCoords = [];

// New map
var initialize = function() {
map  = new google.maps.Map(document.getElementById('map-canvas'), {center:{lat:lat,lng:lng},zoom:18});
mark = new google.maps.Marker({position:{lat:lat, lng:lng}, map:map});
};
window.initialize = initialize;

// Draw map
var redraw = function(payload) {
    if(payload != null){
        lat = payload.lat;
        lng = payload.lng;
        map.setCenter({lat:lat, lng:lng, alt:0});
        mark.setPosition({lat:lat, lng:lng, alt:0});
        lineCoords.push(new google.maps.LatLng(lat, lng));
        var lineCoordinatesPath = new google.maps.Polyline({
            path: lineCoords,
            geodesic: true,
            strokeColor: '#2E10FF'
        });
    lineCoordinatesPath.setMap(map);}
};

function setGPS(gps){
    document.getElementById("lat").innerHTML = gps.lat;
    document.getElementById("lng").innerHTML = gps.lng;
}

// Update realtime GPS
socketIO.on("send-gps", (gps)=>{
    redraw(gps)
    setGPS(gps)
})
// Navbar
const linkColor = document.querySelectorAll(".nav__link");
function colorLink(){
    linkColor.forEach(l => l.classList.remove("active"))
    this.classList.add("active")
}
linkColor.forEach(l => l.addEventListener("click", colorLink))