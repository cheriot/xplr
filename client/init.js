import React from 'react/addons';
import Router from 'react-router';
import routes from '../react/routes';

var mountNode = document.getElementById("react-main-mount");

Router.run(routes, Router.HistoryLocation, (Handler, state) => {
  React.render(<Handler/>, mountNode);
});
