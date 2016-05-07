var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var app = express();
var MongoClient = mongodb.MongoClient;
app.use(express.static("."));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/images'));
app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index2.html");
});

app.get("/getEvents", function (req, res) {
    console.log("Ready to serve Data.");
    var collection;
    MongoClient.connect("mongodb://localhost:27017/event_data", function (err, db) {
        if (err) {
            console.log("Unable to get Events.");
        } else {
            console.log("Connected to get Events.");
            collection = db.collection("event_data");
            collection.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        }
    });
});

app.post("/registerUser", function (req, res) {
    var doc = req.body;
    console.log(doc);
    var collection;
    MongoClient.connect("mongodb://localhost:27017/user_data", function (err, db) {
        if (err) {
            console.log("Unable to connect.");
        } else {
            console.log("Connected to insert.");
            collection = db.collection("user_data");
            collection.insert(doc, { w: 1 }, function (err, record) {
                console.log(record);
                res.send(record.ops[0]);
            });
        }
    });
    //res.send("Data Recieved");
});

app.post("/addEvent", function (req, res) {
    var doc = req.body;
    console.log(doc);
    var collection;
    MongoClient.connect("mongodb://localhost:27017/event_data", function (err, db) {
        if (err) {
            console.log("Unable to connect.");
        } else {
            console.log("Connected to insert.");
            collection = db.collection("event_data");
            collection.insert(doc, { w: 1 }, function (err, record) {
                console.log(record);
                res.send(record.ops[0]);
            });
        }
    });
    //res.send("Data Recieved");
});
app.listen(5000, function () {
    console.log("Working on port 5000");
});