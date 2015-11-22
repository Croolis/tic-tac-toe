var express = require('express');
var router = express.Router();
var temp_models = require('../models/models');
var models = new temp_models();

var ws_rooms = new Array();
var room_code = 0;

router.get('/', function(req, res, next) {
  models.GetAuth(req, res, next);
});

router.get('/reg', function(req, res, next) {
  models.GetReg(req, res, next);
});

router.get('/logout', function(req, res, next) {
  models.Logout(req, res, next);
});

router.post('/reg', function(req, res, next) {
  models.Register(req, res, next);
});

router.post('/auth', function(req, res, next) {
  models.Auth(req, res, next);
});

router.get('/rooms', function(req, res, next) {
  models.GetRooms(req, res, next);
});

router.get('/createRoom', function(req, res, next) {
  models.GetCreateRoom(req, res, next);
});

router.post('/addNewRoom', function(req, res, next) {
  models.CreateRoom(req, res, next);
});

router.post('/game', function(req, res, next) {
  models.JoinRoom(req, res, next);
});

module.exports = router;