import nconf from 'nconf';

nconf
  .file('secret', 'config/secrets.json')
  .file('config/application.json');

export default nconf.get();
