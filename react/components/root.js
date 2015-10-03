import React from 'react/addons';
import Router from 'react-router';

class Root extends React.Component {
  render() {
    return (
      <div>
        Hello, World.
        <Router.RouteHandler/>
      </div>
    );
  }
}

module.exports = Root;
