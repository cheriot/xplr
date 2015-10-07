import React from 'react/addons';
import Router from 'react-router';
import routes from '../react/routes';
import alt from '../react/alt_dispatcher';
import Iso from 'iso';

Iso.bootstrap((state, meta, domNode) => {
  alt.bootstrap(state);

  Router.run(routes, Router.HistoryLocation, (Handler, state) => {
    React.render(<Handler {...state} />, domNode);
  });
});
