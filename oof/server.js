var express = require(‘express’);
var bodyParser = require(‘body-parser’);
var Pusher = require(‘pusher’);

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ 
app_id = "1167265"
key = "42814e7eee3ac29a7752"
secret = "0688d7bb7ca84cca74f1"
cluster = "ap2"
});

app.post(‘/pusher/auth’, function(req, res) {
    var socketId = req.body.socket_id;
    var channel = req.body.channel_name;
    var auth = pusher.authenticate(socketId, channel);
    res.send(auth);
});

app.post(‘/message’, function(req, res) {
    var message = req.body.message;
    var name = req.body.name;
    pusher.trigger( ‘private-chat’, ‘message-added’, { message, name });
    res.sendStatus(200);
});

app.get(‘/’,function(req,res){
    res.sendFile(‘/public/index.html’, {root: __dirname });
});

app.use(express.static(__dirname + ‘/public’));

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log(`app listening on port ${port}!`)
});
