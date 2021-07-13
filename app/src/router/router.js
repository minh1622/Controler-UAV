const express = require("express");
const router = express.Router()

router.get("/", function(req,res){
    res.render("trangchu");
})

router.get("/stream", function(req,res){
    res.render("stream");
})

module.exports = router