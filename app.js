var express = require("express");
var app = express();
var cons = require("consolidate");
var fs = require("fs");
const { parse } = require("path");
app.engine('html', cons.swig)
app.use(express.static("./public"));
app.set("view engine", "html");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000,"127.0.0.1");


io.on("connection", function(socket){
    console.log("new connection: "+ socket.id)
    sendGps(socket)
})


function sendGps(socket)
{
    var string = fs.readFileSync("./gps.txt", {encoding: "utf-8"})
    var parseString = JSON.parse(string);
    var GPS = {lat: parseFloat(parseString.Lat[0].value), lng: parseFloat(parseString.Lng[0].value)}
    socket.emit("send-gps", GPS)
    setInterval(()=>{
        sendGps(socket);
    },3000)
}
app.get("/", function(req,res){
    res.render("trangchu");
})