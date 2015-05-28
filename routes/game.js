var express = require('express');
var router = express.Router();

var ws = require("nodejs-websocket");

var ws_rooms = new Array();
var room_code = 0;

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

var ws_handler = function(conn) {
  console.log('New connection');
  conn.on('text', function (str) {
    var resp = JSON.parse(str);
    var room;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == resp.id)
        room = i;
    console.log(room);
    if (resp.header == 'connected') {
      if (ws_rooms[room].players.length < 2) {
        var player = new Object();
        player.key = conn.key;
        if (ws_rooms[room].players.length == 0 ||
            (ws_rooms[room].players.length == 1 && player != ws_rooms[room].players[0]))
          ws_rooms[room].players[ws_rooms[room].players.length] = player;
      }
      //console.log(server.connections);
      if (ws_rooms[room].players.length == 2) {
        console.log(ws_rooms[room]);
        console.log(ws_rooms[room].players[1]);
        var msg = new Object();
        msg.field = ws_rooms[room].field;
        msg.turn = ws_rooms[room].turn;
        conn.sendText(JSON.stringify(msg));
        server.connections.forEach(function (conn) {
          if (conn.key == ws_rooms[room].players[0].key || 
              conn.key == ws_rooms[room].players[1].key)
            conn.sendText(msg);
        });
      }    
    }
  });
  conn.on('close', function (code, reason) {
    console.log('Connection closed');
  });
};

var server = ws.createServer(ws_handler).listen(3001);

router.get('/rooms', function(req, res, next) {
  if (!req.signedCookies.login) {
    res.redirect('/');
  } else {
    console.log(JSON.stringify(ws_rooms));
    res.render('rooms', { title: 'Список комнат', rooms: JSON.stringify(ws_rooms) });
  }
});

router.get('/createRoom', function(req, res, next) {
  res.render('new_room', { title: 'Создать комнату'});
});

router.post('/addNewRoom', function(req, res, next) {
  room = new Object();
  room.name = req.body.name;
  room.players = new Array();
  room.field = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
  room.id = room_code;
  room.turn = 0;
  room_code++;
  ws_rooms[ws_rooms.length] = room;
  res.redirect('/rooms');
});

router.post('/game', function(req, res, next) {
  var room_number;
  for (var i = 0; i < ws_rooms.length; i++)
    if (ws_rooms[i].id == req.body.id)
      room_number = i;
  console.log(room_number);
  if (ws_rooms[room_number].players.length < 2)
    res.render('game', { title: 'Комната ' + ws_rooms[room_number].name, id : ws_rooms[room_number].id});
  else
    res.redirect('/rooms');
});

module.exports = router;
