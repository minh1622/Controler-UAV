var mqtt = require('mqtt')

exports.pubdata = (req, res) => {
    var data = req.body
    data = JSON.stringify(data)
    var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
        username: "4oEJi3aA5Gya2hpY3jRU"
    })
    console.log(data)
    client.on('connect', function () {
        console.log('connected')
        // client.subscribe('v1/devices/me/attributes/response/+')
        client.publish('v1/devices/me/telemetry', data)
        client.end()
    })
    res.send("oke")
}
exports.result = (req, res) =>{
    res.send("oke")
}