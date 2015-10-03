// Configure superagent to work with es6 promises.
// https://github.com/lightsofapollo/superagent-promise
module.exports = require('superagent-promise')(require('superagent'), Promise);

