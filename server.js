// newrelic needs to come before babel to instrument express and pg.
require('newrelic');
// babel needs to come before requiring files that use ES6
require('./babel');
var throng = require('throng');

// Concurrency based on https://devcenter.heroku.com/articles/node-concurrency
console.log("starting with WEB_MEMORY", process.env.WEB_MEMORY, "WEB_CONCURRENCY", process.env.WEB_CONCURRENCY, "MEMORY_AVAILABLE", process.env.MEMORY_AVAILABLE);

var WORKERS = process.env.WEB_CONCURRENCY || 1;

function start() {
  console.log('Started worker. Initializing request handlers...');
  require('./server/init');
  process.on('SIGTERM', function() {
    console.log('Worker exiting');
    process.exit();
  });
}

throng(start, {
  workers: WORKERS,
  lifetime: Infinity,
  grace: 4000
});
