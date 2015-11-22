var temp_controls = require('../controllers/renders');
var controls = new temp_controls();

var Model = function() {
  var Rooms = require('./rooms_container');
  var ws_rooms;
  var room_code = 0;

  var mongoose = require('mongoose');
  var accountShema = mongoose.Schema({
      name: String,
      password: String
  })

  var Account = mongoose.model('Account', accountShema);
  mongoose.connect('mongodb://localhost/test');
  //mongoose.connect('mongodb://1:1@ds031842.mongolab.com:31842/xoxo');
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

  this.Auth = function(req, res, next) {
    Account.find({name: req.body.login, password: req.body.password}, function(err, accounts) {
      if (err) return console.error(err);
      if (accounts.length == 0) {
        controls.IncorrectAuth(res);
      } else {
        res.cookie('login', req.body.login, { path: '/', signed: true });
        controls.RedirRooms(res);
      }
    });    
  }

  this.Register = function(req, res, next) {
    if (req.body.password != req.body.repeat_password) {
      controls.FailRepeatPass(res);
    } else {
      Account.find({name: req.body.login}, function(err, accounts) {
        if (err) return console.error(err);
        if (accounts.length != 0) {
          controls.AccountExists(res);
        } else {
          var new_account = new Account({name : req.body.login, password : req.body.password});
          new_account.save(function (err, new_account) {
            if (err) return console.error(err);
          });
          controls.SuccessReg(res);
        }
      });
    }
  }

  this.Logout = function(req, res, next) {
    res.clearCookie('login', { path: '/' });
    controls.Auth(res);
  }

  this.GetReg = function(req, res, next) {
    if (req.signedCookies.login)
      controls.RedirRooms(res);
    else
      controls.Reg(res);
  }

  this.GetAuth = function(req, res, next) {
    if (req.signedCookies.login)
      controls.RedirRooms(res);
    else
      controls.Auth(res);
  }

  this.GetRooms = function(req, res, next) {
    if (req.signedCookies.login) {
      ws_rooms = Rooms.ws_rooms;
      controls.Rooms(res, ws_rooms);
    }
    else
      controls.RedirAuth(res);
  }

  this.GetCreateRoom = function(req, res, next) {
    if (req.signedCookies.login)
      controls.CreateRoom(res);
    else
      controls.RedirAuth(res);
  }

  this.CreateRoom = function(req, res, next) {
    room = new Object();
    room.name = req.body.name;
    room.players = new Array();
    room.field = [[{"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}, {"filled" : 0, "won" : 0}], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
    room.id = room_code;
    room.turn = 0;
    room.prev_x = -1;
    room.prev_y = -1;
    room_code++;
    Rooms.add_room(room);
    controls.RedirRooms(res);
  }

  this.JoinRoom = function(req, res, next) {
    var room_number;
    ws_rooms = Rooms.ws_rooms;
    for (var i = 0; i < ws_rooms.length; i++)
      if (ws_rooms[i].id == req.body.id)
        room_number = i;
    if (ws_rooms[room_number].players.length < 2)
      res.render('game', { title: 'Комната ' + ws_rooms[room_number].name, id : ws_rooms[room_number].id});
    else
      controls.RedirRooms(res);
  }
}

module.exports = Model;