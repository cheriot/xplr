import React from 'react/addons';
import { RouteHandler } from 'react-router';

class Root extends React.Component {
  render() {
    const brandTitle = {color: 'gray'};
    const brandSubtitle = {color: 'lightgray', fontSize: '18px'};

    return (
      <div>
        <h1 style={brandTitle}>
          <a href='/'>Xplr.in</a>
          <span style={brandSubtitle}> beyond lonely planet </span>
        </h1>
        <RouteHandler />
      </div>
    );
  }
}

module.exports = Root;
