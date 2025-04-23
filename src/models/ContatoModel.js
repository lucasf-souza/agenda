const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false,default: '' },
  criadoEm: { type: Date , default: Date.now },
  descricao: String
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }
}

Contato.prototype.register = async function() {
  this.valida()
  if(this.errors.length > 0) return
  this.contato = await ContatoModel.create(this.body)
}


Contato.prototype.valida = function() {
  this.cleanUp();

  console.log('Iniciando validação');
  
  if (this.body.email && !validator.isEmail(this.body.email)) {
    this.errors.push('E-mail inválido');
  }
  
  if (!this.body.nome) {
    this.errors.push('Nome é um campo obrigatório.');
  }

  if (!this.body.email && !this.body.telefone) {
    this.errors.push('Ao menos um contato tem que ser adicionado: Telefone ou e-mail.');
  }

  console.log('Erros encontrados:', this.errors);  // Logar erros para depuração
};

Contato.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  console.log('Dados após limpeza:', this.body);  // Verifique os dados após a limpeza

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone
  };
};


module.exports = Contato;


