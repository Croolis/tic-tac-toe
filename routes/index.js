var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var accountShema = mongoose.Schema({
    name: String,
    password: String
})
var Account = mongoose.model('Account', accountShema);
mongoose.connect('mongodb://localhost/test');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.signedCookies.login) {
    res.redirect('/rooms');
  } else {
    res.render('auth', { title: 'Авторизация', welcome_text: 'Добро пожаловать',
    act: '/auth', redir: '/reg', redir_text: 'Регистрация', button_text: 'Войти'});
  }
});

router.get('/reg', function(req, res, next) {
  res.render('auth', { title: 'Регистрация', welcome_text: 'Добро пожаловать',
  act: '/reg', redir: '/', redir_text: 'Авторизация', button_text: 'Зарегистрироваться'});
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('login', { path: '/' });
  res.redirect('/');
});

router.post('/reg', function(req, res, next) {
  var login = req.body.login, pass = req.body.password;
  if (pass != req.body.repeat_password) {
    res.render('auth', { title: 'Регистрация', welcome_text: 'Пароли не совпадают',
    act: '/reg', redir: '/', redir_text: 'Авторизация', button_text: 'Зарегистрироваться'});    
  } else {
    Account.find({name: login}, function(err, accounts) {
      if (err) return console.error(err);
      if (accounts.length != 0) {
        res.render('auth', { title: 'Регистрация', welcome_text: 'Пользователь с таким именем уже существует',
        act: '/reg', redir: '/', redir_text: 'Авторизация', button_text: 'Зарегистрироваться'});
      } else {
        var new_account = new Account({name : login, password : pass});
        new_account.save(function (err, new_account) {
          if (err) return console.error(err);
        });
        res.render('auth', { title: 'Авторизация', welcome_text: 'Вы успешно зарегестрированы', 
        act: '/auth', redir: '/reg', redir_text: 'Регистрация', button_text: 'Войти'});
      }
    });
  }
});

router.post('/auth', function(req, res, next) {
  var login = req.body.login, pass = req.body.password;

  Account.find({name: login, password: pass}, function(err, accounts) {
    if (err) return console.error(err);
    if (accounts.length == 0) {
      res.render('auth', { title: 'Авторизация', welcome_text: 'Неверное имя или пароль', 
      act: '/auth', redir: '/reg', redir_text: 'Регистрация', button_text: 'Войти'});
    } else {
      res.cookie('login', login, { path: '/', signed: true });
      res.redirect('/rooms');
    }
  });
});



module.exports = router;
