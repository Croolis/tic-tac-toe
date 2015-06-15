var express = require('express');
var router = express.Router();

var ws = require("nodejs-websocket");

var ws_rooms = new Array();
var room_code = 0;

function Is_won(s_x, s_y, field) {
  if ((field[s_x][s_y].filled == field[s_x][s_y + 2].filled) 
    && (field[s_x][s_y + 1].filled == field[s_x][s_y + 2].filled) 
    && (field[s_x][s_y + 2].filled != 0)) {
    console.log(field[s_x][s_y].filled + ' ' + field[s_x][s_y + 1].filled + ' ' + field[s_x][s_y + 2].filled);
    return field[s_x][s_y + 2].filled + 1;
  }
  if ((field[s_x + 1][s_y].filled == field[s_x + 1][s_y + 2].filled) 
    && (field[s_x + 1][s_y + 1].filled == field[s_x + 1][s_y + 2].filled) 
    && (field[s_x + 1][s_y + 2].filled != 0)) {
    console.log(field[s_x + 1][s_y].filled + ' ' + field[s_x + 1][s_y + 1].filled + ' ' + field[s_x + 1][s_y + 2].filled);
    return field[s_x + 1][s_y + 2].filled + 1;
  }
  if ((field[s_x + 2][s_y].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 2][s_y + 1].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 2][s_y + 2].filled != 0)) {
    console.log(field[s_x + 2][s_y].filled + ' ' + field[s_x + 2][s_y + 1].filled + ' ' + field[s_x + 2][s_y + 2].filled);
    return field[s_x + 2][s_y + 2].filled + 1;
  }
  if ((field[s_x][s_y].filled == field[s_x + 2][s_y].filled) 
    && (field[s_x + 1][s_y].filled == field[s_x + 2][s_y].filled) 
    && (field[s_x + 2][s_y].filled != 0)) {
    console.log(field[s_x][s_y].filled + ' ' + field[s_x + 1][s_y].filled + ' ' + field[s_x + 2][s_y].filled);
    return field[s_x + 2][s_y].filled + 1;
  }
  if ((field[s_x][s_y + 1].filled == field[s_x + 2][s_y + 1].filled) 
    && (field[s_x + 1][s_y + 1].filled == field[s_x + 2][s_y + 1].filled) 
    && (field[s_x + 2][s_y + 1].filled != 0)) {
    console.log(field[s_x][s_y + 1].filled + ' ' + field[s_x + 2][s_y + 1].filled + ' ' + field[s_x + 1][s_y + 1].filled);
    return field[s_x + 2][s_y + 1].filled + 1;
  }
  if ((field[s_x][s_y + 2].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 1][s_y + 2].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 2][s_y + 2].filled != 0)) {
    console.log(field[s_x][s_y + 2].filled + ' ' + field[s_x + 1][s_y + 2].filled + ' ' + field[s_x + 1][s_y + 2].filled);
    return field[s_x + 2][s_y + 2].filled + 1;
  }
  if ((field[s_x][s_y].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 1][s_y + 1].filled == field[s_x + 2][s_y + 2].filled) 
    && (field[s_x + 2][s_y + 2].filled != 0)) {
    console.log(field[s_x][s_y].filled + ' ' + field[s_x + 1][s_y + 1].filled + ' ' + field[s_x + 2][s_y + 2].filled);
    return field[s_x + 2][s_y + 2].filled + 1;
  }
  if ((field[s_x + 2][s_y].filled == field[s_x][s_y + 2].filled) 
    && (field[s_x + 1][s_y + 1].filled == field[s_x][s_y + 2].filled) 
    && (field[s_x][s_y + 2].filled != 0)) {
    console.log(field[s_x][s_y + 2].filled + ' ' + field[s_x + 1][s_y + 1].filled + ' ' + field[s_x + 2][s_y].filled);
    return field[s_x][s_y + 2].filled + 1;
  }
  flag = true;
  for (var it1 = 0; it1 < 3; it1++)
    for (var it2 = 0; it2 < 3; it2++)
      if (field[s_x + it1][s_y + it2].filled == 0)
        flag = false;
  if (flag)
    return 1;
  else
    return 0;
}

function Is_g_won(field) {
  if (field[0][0].win == field[0][3].win &&
      field[0][0].win == field[0][6].win &&
      field[0][0].win > 1)
    return field[0][0].win;
  if (field[3][0].win == field[3][3].win &&
      field[3][0].win == field[3][6].win &&
      field[3][0].win > 1)
    return field[3][0].win;
  if (field[6][0].win == field[6][3].win &&
      field[6][0].win == field[6][6].win &&
      field[6][0].win > 1)
    return field[6][0].win;
  if (field[0][0].win == field[3][0].win &&
      field[0][0].win == field[6][0].win &&
      field[0][0].win > 1)
    return field[0][0].win;
  if (field[0][3].win == field[3][3].win &&
      field[0][3].win == field[6][3].win &&
      field[0][3].win > 1)
    return field[0][3].win;
  if (field[0][6].win == field[3][6].win &&
      field[0][6].win == field[6][6].win &&
      field[0][6].win > 1)
    return field[0][6].win;
  if (field[0][0].win == field[3][3].win &&
      field[0][0].win == field[6][6].win &&
      field[0][0].win > 1)
    return field[0][0].win;
  if (field[0][6].win == field[3][3].win &&
      field[0][6].win == field[6][0].win &&
      field[0][6].win > 1)
    return field[0][6].win;
  var f = true;
  for (var i = 0; i < 9; i++)
    for (var j = 0; j < 9; j++)
      if (field[i][j].filled == 0)
        f = false;
  if (f)
    return 1;
  else
    return 0;
}

function Valid_rect(prev_x, prev_y, x, y) {
  return (Math.floor(x / 3) == prev_x % 3) && (Math.floor(y / 3) == prev_y % 3);
}

var ws_handler = function(conn) {
  console.log('New connection');
  conn.on('text', function (str) {
    var resp = JSON.parse(str);
    var room;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == resp.id)
        room = i;
    if (resp.header == 'connected') {
      if (ws_rooms[room].players.length < 2) {
        var player = new Object();
        player.key = conn.key;
        if (ws_rooms[room].players.length == 0 ||
            (ws_rooms[room].players.length == 1 && player != ws_rooms[room].players[0]))
          ws_rooms[room].players[ws_rooms[room].players.length] = player;
      }
      if (ws_rooms[room].players.length == 2) {
        var msg = new Object();
        ws_rooms[room].field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
        ws_rooms[room].prev_x = -1;
        msg.endgame = 'no';
        msg.field = ws_rooms[room].field;
        msg.turn = ws_rooms[room].turn;
        server.connections.forEach(function (conn) {
          if (conn.key == ws_rooms[room].players[0].key || 
              conn.key == ws_rooms[room].players[1].key)
            conn.sendText(JSON.stringify(msg));
        });
      }    
    }
    if (resp.header == 'turn' && resp.x < 9 && resp.x >= 0 && resp.y < 9 && resp.y >= 0 &&
        ws_rooms[room].field[resp.x][resp.y].filled == 0 && 
        ws_rooms[room].field[resp.x][resp.y].won == 0) {
      if ((conn.key == ws_rooms[room].players[0].key && ws_rooms[room].turn == 0) ||
          (conn.key == ws_rooms[room].players[1].key && ws_rooms[room].turn == 1)) {
        if (ws_rooms[room].prev_x == -1 || 
          ws_rooms[room].field[ws_rooms[room].prev_x % 3][ws_rooms[room].prev_y % 3].won != 0 || 
          Valid_rect(ws_rooms[room].prev_x, ws_rooms[room].prev_y, resp.x, resp.y)) {
          ws_rooms[room].field[resp.x][resp.y].filled = ws_rooms[room].turn + 1;
          var t = Is_won(Math.floor(resp.x / 3) * 3, Math.floor(resp.y / 3) * 3, ws_rooms[room].field);
            for (var it1 = 0; it1 < 3; it1++)
              for (var it2 = 0; it2 < 3; it2++)
                ws_rooms[room].field[Math.floor(resp.x / 3) * 3 + it1][Math.floor(resp.y / 3) * 3 + it2].won = t;     
          ws_rooms[room].turn = (ws_rooms[room].turn + 1) % 2;
          ws_rooms[room].prev_x = resp.x;
          ws_rooms[room].prev_y = resp.y;
          var msg = new Object();
          msg.endgame = 'no';
          if (t != 0){
            t = Is_g_won(ws_rooms[room].field);
            if (t == 1)
              msg.endgame = 'tie';
            if (t == 2)
              msg.endgame = 'tic';
            if (t == 3)
              msg.endgame = 'tac';
          }     
          msg.header = 'turn';
          msg.field = ws_rooms[room].field;
          msg.turn = ws_rooms[room].turn;
          server.connections.forEach(function (conn) {
            if (conn.key == ws_rooms[room].players[0].key || 
                conn.key == ws_rooms[room].players[1].key)
              conn.sendText(JSON.stringify(msg));
          });
        }
      }
    }
  });
  conn.on('close', function (code, reason) {
    console.log(code);
    console.log(reason);
    for (var i = 0; i < ws_rooms.length; i++) {
      if (ws_rooms[i].players.length == 0)
        continue;
      if (ws_rooms[i].players.length == 1)
        if (conn.key == ws_rooms[i].players[0].key) {
          ws_rooms[i].players = new Array();
        }
      if (ws_rooms[i].players.length == 2) {
        if (conn.key == ws_rooms[i].players[1].key) {
          ws_rooms[i].field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
          ws_rooms[i].prev_x = -1;          
          ws_rooms[i].players.splice(1, 2);
          var msg = new Object();
          msg.endgame = 'leave';
          server.connections.forEach(function (conn) {
          if (conn.key == ws_rooms[i].players[0].key)
            conn.sendText(JSON.stringify(msg));
          });
        }
        if (conn.key == ws_rooms[i].players[0].key) {
          ws_rooms[i].field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
          ws_rooms[i].prev_x = -1;
          ws_rooms[i].players.splice(0, 1);
          var msg = new Object();
          msg.endgame = 'leave';
          server.connections.forEach(function (conn) {
          if (conn.key == ws_rooms[i].players[0].key)
            conn.sendText(JSON.stringify(msg));
          });
        }
      }
    }
    console.log('Connection closed');
  });
};

/*var server = ws.createServer(ws_handler).listen(3001);
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({server: server});
wss.on("connection", ws_handler)*/

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
  })
})

router.get('/rooms', function(req, res, next) {
  if (!req.signedCookies.login) {
    res.redirect('/');
  } else {
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
  room.field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
  room.id = room_code;
  room.turn = 0;
  room.prev_x = -1;
  room.prev_y = -1;
  room_code++;
  ws_rooms[ws_rooms.length] = room;
  res.redirect('/rooms');
});

router.post('/game', function(req, res, next) {
  var room_number;
  for (var i = 0; i < ws_rooms.length; i++)
    if (ws_rooms[i].id == req.body.id)
      room_number = i;
  if (ws_rooms[room_number].players.length < 2)
    res.render('game', { title: 'Комната ' + ws_rooms[room_number].name, id : ws_rooms[room_number].id});
  else
    res.redirect('/rooms');
});

module.exports = router;
