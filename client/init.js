import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';
import ga from 'react-ga';

// Importing stylesheets only works through webpack, not
// on the server.
import './stylesheets/application.less';

Iso.bootstrap((state, meta, domNode) => {
  alt.bootstrap(state);

  console.log('initialize google analytics', GA_TRACKING_CODE);
  ga.initialize(GA_TRACKING_CODE);

  Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    ga.pageview(state.pathname);
    ReactDOM.render(<Handler {...state} />, domNode);
  });
});
