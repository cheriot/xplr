import React from 'react/addons';
import Router from 'react-router';
import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';

// Importing stylesheets only works through webpack, not
// on the server.
import './stylesheets/application.less';

Iso.bootstrap((state, meta, domNode) => {
  alt.bootstrap(state);

  Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(<Handler {...state} />, domNode);
  });
});
