import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';
import ga from 'react-ga';

// Importing stylesheets and images only works through webpack, not
// on the server.
import './stylesheets/application.less';
import './index.ejs';

Iso.bootstrap((state, meta, domNode) => {
  alt.bootstrap(state);

  console.log('initialize google analytics', GA_TRACKING_CODE);
  ga.initialize(GA_TRACKING_CODE);

  const history = createBrowserHistory()
  history.listen(location => ga.pageview(location.pathname));
  ReactDOM.render(<Router history={history}>{routes}</Router>, domNode);
});
