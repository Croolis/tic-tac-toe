var render = function() {

  this.Auth = function(res) {
    res.render('auth', { title: 'Авторизация', welcome_text: 'Добро пожаловать'});
  }

  this.Reg = function(res) {
    res.render('reg', { title: 'Регистрация', welcome_text: ''});
  }

  this.Rooms = function(res, ws_rooms) {
    res.render('rooms', { title: 'Список комнат', rooms: JSON.stringify(ws_rooms) });
  }

  this.Room = function(res, ws_rooms, room_number) {
    res.render('game', { title: 'Комната ' + ws_rooms[room_number].name, id : ws_rooms[room_number].id});
  }

  this.CreateRoom = function(res) {
    res.render('new_room', { title: 'Создать комнату'});
  }

  this.RedirRooms = function(res) {
    res.redirect('/rooms');
  }

  this.RedirAuth = function(res) {
    res.redirect('/');
  }

  this.IncorrectAuth = function(res) {
    res.render('auth', { title: 'Авторизация', welcome_text: 'Неправильный пароль'});
  }

  this.FailRepeatPass = function(res) {
    res.render('reg', { title: 'Регистрация', welcome_text: 'Пароли не совпадают'});
  }

  this.SuccessReg = function(res) {
    res.render('auth', { title: 'Авторизация', welcome_text: 'Вы успешно зарегестрированы'});
  }

  this.AccountExists = function(res) {
    res.render('reg', { title: 'Регистрация', welcome_text: 'Пользователь с таким именем уже существует'});
  }
}

module.exports = render;