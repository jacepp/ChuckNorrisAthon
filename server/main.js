/*jslint node: true */
'use strict';
var express = require('express'),
    routes = require('./routes'),
    app = express();


app.use(express.bodyParser());


app.get('*', function(req, res) {
  res.status(404);
});

app.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

module.exports = app;