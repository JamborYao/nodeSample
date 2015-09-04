
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var common = require('./common.js');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', function (req, res) {
    common.generateSAS(res);
    console.log('post called');
	
})


app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.post('/createStorage', function (req, res) {
    
    var containername = req.body.containerName;
    console.log(containername);
    common.createContainer(containername);
    res.end();
})

app.post('/list', function (req, res) {
    common.readData(res);
	
})

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
