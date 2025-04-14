exports.middlewareGlobal = (req, res, next) => {
  res.locals.umaVariavelLocal = 'Valor Da Local'
    next();
  };
  
  exports.outroMiddleware = (req, res, next) => {
    next();
  };

  exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN'){
      return res.render('404')
    }
  }

  exports.csrfMiddleware = (req,res,next) => {
    res.locals.csrfToken = req.csrfToken ()
    next()
  }