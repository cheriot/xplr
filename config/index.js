import nconf from 'nconf';

nconf
  .env()
  .file('config/application.json');

export default nconf.get();
