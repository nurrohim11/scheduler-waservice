const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'gmedia.bz',
    user : 'gmedia',
    password : 'mxdza67gjs',
    database : 'gmedia_sms'
  }
});

module.exports = { knex }