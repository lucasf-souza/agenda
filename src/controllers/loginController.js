const Login = require('../models/loginmodel');

exports.index = (req, res) => {
  res.render('login');
}

exports.register = async function (req, res) {
  const login = new Login(req.body);
  await login.register();

  if (login.errors.length > 0) {
    req.flash('errors', login.errors);
    req.session.save(function(){
        return res.redirect('back');
    });
    return;
}


  req.flash('success', 'Usuário cadastrado com sucesso!');
  req.session.save(() => res.redirect('/login'));
}
