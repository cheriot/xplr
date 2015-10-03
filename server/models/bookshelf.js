import initKnex from 'knex';
var knex = initKnex({
  client: 'sqlite3',
  connection: {
    filename: './db/dev.sqlite3'
  },
  pool: {
    min: 1,
    max: 1
  }
});

module.exports = require('bookshelf')(knex);
