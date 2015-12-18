import initKnex from 'knex';
var knex = initKnex({
  client: 'pg',
  connection: {
    database: 'xplr_development'
  },
  pool: {
    min: 1,
    max: 1
  }
});

module.exports = knex;
