var GameLogic = function() {
  var Rooms = require('./rooms_container');
  
  function Is_won(s_x, s_y, field) {
    if ((field[s_x][s_y].filled == field[s_x][s_y + 2].filled) 
      && (field[s_x][s_y + 1].filled == field[s_x][s_y + 2].filled) 
      && (field[s_x][s_y + 2].filled != 0)) {
      return field[s_x][s_y + 2].filled + 1;
    }
    if ((field[s_x + 1][s_y].filled == field[s_x + 1][s_y + 2].filled) 
      && (field[s_x + 1][s_y + 1].filled == field[s_x + 1][s_y + 2].filled) 
      && (field[s_x + 1][s_y + 2].filled != 0)) {
      return field[s_x + 1][s_y + 2].filled + 1;
    }
    if ((field[s_x + 2][s_y].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 2][s_y + 1].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 2][s_y + 2].filled != 0)) {
      return field[s_x + 2][s_y + 2].filled + 1;
    }
    if ((field[s_x][s_y].filled == field[s_x + 2][s_y].filled) 
      && (field[s_x + 1][s_y].filled == field[s_x + 2][s_y].filled) 
      && (field[s_x + 2][s_y].filled != 0)) {
      return field[s_x + 2][s_y].filled + 1;
    }
    if ((field[s_x][s_y + 1].filled == field[s_x + 2][s_y + 1].filled) 
      && (field[s_x + 1][s_y + 1].filled == field[s_x + 2][s_y + 1].filled) 
      && (field[s_x + 2][s_y + 1].filled != 0)) {
      return field[s_x + 2][s_y + 1].filled + 1;
    }
    if ((field[s_x][s_y + 2].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 1][s_y + 2].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 2][s_y + 2].filled != 0)) {
      return field[s_x + 2][s_y + 2].filled + 1;
    }
    if ((field[s_x][s_y].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 1][s_y + 1].filled == field[s_x + 2][s_y + 2].filled) 
      && (field[s_x + 2][s_y + 2].filled != 0)) {
      return field[s_x + 2][s_y + 2].filled + 1;
    }
    if ((field[s_x + 2][s_y].filled == field[s_x][s_y + 2].filled) 
      && (field[s_x + 1][s_y + 1].filled == field[s_x][s_y + 2].filled) 
      && (field[s_x][s_y + 2].filled != 0)) {
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

  this.OnConnected = function(io, socket, msg) {
    var ws_rooms = Rooms.ws_rooms;
    var resp = JSON.parse(msg);
    var room, index;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == resp.id) {
        room = ws_rooms[i];
        index = i;
      }

    if (room.players.length < 2) {
      var player = new Object();
      player.key = socket.id;
      if (room.players.length == 0 ||
         (room.players.length == 1 && 
          player != room.players[0])) {
        room.players[room.players.length] = player;
        Rooms.replace_room(index, room);
        socket.join(JSON.parse(msg).id);
      }
    }
    if (room.players.length == 2) {
      var send = new Object();
      room.field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
      room.prev_x = -1;
      Rooms.replace_room(index, room);
      send.endgame = 'no';
      send.field = room.field;
      send.turn = room.turn;
      io.to(resp.id).emit('turn', JSON.stringify(send));
    }    
  }

  this.OnTurn = function(io, socket, msg) {
    var ws_rooms = Rooms.ws_rooms;
    var resp = JSON.parse(msg);
    var room, index;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == resp.id) {
        room = ws_rooms[i];
        index = i;
      }

    if (resp.x < 9 && resp.x >= 0 && resp.y < 9 && resp.y >= 0 &&
        room.field[resp.x][resp.y].filled == 0 && 
        room.field[resp.x][resp.y].won == 0) {
      if ((socket.id == room.players[0].key && room.turn == 0) ||
          (socket.id == room.players[1].key && room.turn == 1)) {
        if (room.prev_x == -1 || 
          room.field[room.prev_x % 3][room.prev_y % 3].won != 0 || 
          Valid_rect(room.prev_x, room.prev_y, resp.x, resp.y)) {
          room.field[resp.x][resp.y].filled = room.turn + 1;
          var t = Is_won(Math.floor(resp.x / 3) * 3, Math.floor(resp.y / 3) * 3, room.field);
            for (var it1 = 0; it1 < 3; it1++)
              for (var it2 = 0; it2 < 3; it2++)
                room.field[Math.floor(resp.x / 3) * 3 + it1][Math.floor(resp.y / 3) * 3 + it2].won = t;     
          room.turn = (room.turn + 1) % 2;
          room.prev_x = resp.x;
          room.prev_y = resp.y;
          Rooms.replace_room(index, room);
          var send = new Object();
          send.endgame = 'no';
          if (t != 0){
            t = Is_g_won(room.field);
            if (t == 1)
              send.endgame = 'tie';
            if (t == 2)
              send.endgame = 'tic';
            if (t == 3)
              send.endgame = 'tac';
          }     
          send.header = 'turn';
          send.field = room.field;
          send.turn = room.turn;
          io.to(resp.id).emit('turn', JSON.stringify(send));
        }
      }
    }
  }

  this.OnClose = function(io, socket, mes) {
    var ws_rooms = Rooms.ws_rooms;
    var resp = JSON.parse(mes);

    var room, index;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == resp.id) {
        room = ws_rooms[i];
        index = i;
      }

    if (room.players.length == 1)
      if (socket.id == room.players[0].key) {
        room.players = new Array();
        Rooms.delete_room(index);
      }
    if (room.players.length == 2) {
      if (socket.id == room.players[1].key) {
        room.field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
        room.prev_x = -1;          
        room.players.splice(1, 2);
        var msg = new Object();
        msg.endgame = 'leave';
        io.to(resp.id).emit('turn', JSON.stringify(msg));
        Rooms.replace_room(index, room);
      }
      if (socket.id == room.players[0].key) {
        room.field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}]];
        room.prev_x = -1;
        room.players.splice(0, 1);
        var msg = new Object();
        msg.endgame = 'leave';
        io.to(resp.id).emit('turn', JSON.stringify(msg));
        Rooms.replace_room(index, room);
      }
    }
  socket.disconnect(true);
  }

}

module.exports = GameLogic;