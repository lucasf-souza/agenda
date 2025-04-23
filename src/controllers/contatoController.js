const Contato = require ('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato')
}   
exports.register = async (req, res) => {
    try {
      const contato = new Contato(req.body);
      await contato.register();
  
      // Exibe erros no console
      if (contato.errors.length > 0) {
        console.log('Erros de validação:', contato.errors); 
        req.flash('errors', contato.errors);
        req.session.save(() => res.redirect('/Contato'));
        return;
      }
  
      req.flash('success', 'Contato registrado com sucesso.');
      req.session.save(() => res.redirect('/Contato'));
      return;
  
    } catch (e) {
      console.log(e);
      return res.render('404');
    }
  };
  