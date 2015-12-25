import config from '../../config';
import initKnex from 'knex';
var knex = initKnex({
  client: 'pg',
  connection: config.DATABASE_URL,
  pool: {
    min: 1,
    max: 1
  }
});

module.exports = knex;
