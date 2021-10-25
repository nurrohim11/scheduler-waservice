var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use ((req, res, next) => {
  res.print_json = (status, message, response)=> {
    res.json({
      response : response,
      metadata: {
        status:status,
        message:message
      },
    })
  }
  next()
});

app.use('/', indexRouter);

module.exports = app;

// node cron 5-10 menit
// track send message to docker wa service not use api wa
// multi channel 
// jika mengirim pesan gagal di message broker dan wa engine, bisa dikirim lagi gag ?. terus caranya gimana ?.