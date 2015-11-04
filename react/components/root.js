import React from 'react/addons';
import { RouteHandler } from 'react-router';

class Root extends React.Component {
  render() {
    return (
      <div>
        Brand and navigation go here.
        <RouteHandler/>
      </div>
    );
  }
}

module.exports = Root;
