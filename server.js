require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

if (!process.env.connectionstring) {
  console.error('A variável de ambiente "connectionstring" não está definida.');
  process.exit(1);
}

mongoose.connect(process.env.connectionstring)
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida!');
    app.emit('Pronto');
  })
  .catch(e => {
    console.error('Erro ao conectar com o MongoDB:', e);
    process.exit(1); 
  });

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", "https://cdn.jsdelivr.net"],
      'style-src': ["'self'", "https://cdn.jsdelivr.net"],
      'font-src': ["'self'", "https://cdn.jsdelivr.net"],
    }
  }
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
  secret: '2424', 
  store: MongoStore.create({ mongoUrl: process.env.connectionstring }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, 
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash()); 
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Middlewares globais
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);

app.on('Pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
