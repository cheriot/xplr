require('./babel');

var config = require('./config');
// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: config.DATABASE_URL,
    pool: {
      min: 1,
      max: 1
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
  },

  staging: {
    client: 'pg',
    connection: config.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: config.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
  }

};
