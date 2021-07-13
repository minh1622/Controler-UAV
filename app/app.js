const express = require("express");
const app = express();
const path = require('path')
const bodyParser = require("body-parser");
var cons = require("consolidate");
const router = require('./src/router/router')
var server = require("http").Server(app);
const mqttapi = require('./src/router/mqtt.router')

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, '/public')));
app.engine('html', cons.swig)
app.use(express.static("./public"));
app.set("view engine", "html");
app.set("views", "./views");
app.use('/', router)
app.use("/v1/api", mqttapi)



var port = process.env.PORT || 3000


server.listen(port,"127.0.0.1", ()=>{
    console.log(`server listen on port: ${port} `)
});