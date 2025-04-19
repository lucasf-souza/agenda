const Login = require('../models/loginmodel');

exports.index = (req, res) => {
  const errors = req.flash('errors');
  const success = req.flash('success');

  console.log('Erros capturados:', errors);
  console.log('Successo capturado:', success);

  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

exports.register = async function (req, res) {
  const login = new Login(req.body);
  await login.register();

  if (login.errors.length > 0) {
    req.flash('errors',login.errors)
    console.log('Erros enviados para o flash:', login.errors);

    return req.session.save(() => res.redirect('/login'));
  }

  req.flash('success', 'Usuário cadastrado com sucesso!');
  return req.session.save(() => res.redirect('/login'));
};

exports.login = async function (req, res) {
  const login = new Login(req.body);
  await login.login();

  if (login.errors.length > 0) {
    login.errors.forEach(err => req.flash('errors', err));

    console.log('Erros enviados para o flash:', login.errors);

    return req.session.save(() => res.redirect('/login'));
  }

  req.flash('success', 'Login realizado com sucesso!');
  return req.session.save(() => res.redirect('/'));
};




exports.logout = function (req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
