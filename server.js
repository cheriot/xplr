// Which of these really needs to be first?
require('newrelic');
require('./babel');

// Actually start the server.
require('./server/init');
