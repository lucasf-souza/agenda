const Login = require('../models/loginmodel');

exports.index = (req, res) => {
  if (req.session.user) return res.render('login-logado')
  const errors = req.flash('errors');
  const success = req.flash('success');

  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    // Se houver erros durante o registro, exibe-os
    if (login.errors.length > 0) {
      req.flash('errors', login.errors);  // Envia os erros para o flash
      console.log('Erros enviados para o flash:', login.errors);

      return res.render('login', { // Renderiza a página de login novamente com os erros
        csrfToken: req.csrfToken(),
        errors: req.flash('errors'),
      });
    }

    // Se o usuário foi registrado com sucesso
    req.flash('success', 'Usuário cadastrado com sucesso!');
    return res.render('login', {  // Renderiza a página de login novamente com a mensagem de sucesso
      csrfToken: req.csrfToken(),
      success: req.flash('success'),  // A mensagem de sucesso é passada aqui
    });
    
  } catch (e) {
    console.log(e);
    return res.render('404');  // Caso ocorra algum erro inesperado
  }
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
  req.session.user = login.user 
  return req.session.save(() => res.redirect('/login'));
};



exports.logout = function (req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
