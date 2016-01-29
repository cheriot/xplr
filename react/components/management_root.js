import React from 'react';
import { RouteHandler, Link } from 'react-router';

class ManagementRoot extends React.Component {
  render() {
    return (
      <div>
        <ul className='container container-narrow'>
          <li>
            <Link to={`/management/queue`}>queue</Link>
          </li>
          <li>
            <Link to={`/management/feeds`}>feeds</Link>
          </li>
        </ul>
        <RouteHandler/>
      </div>
    );
  }
}

module.exports = ManagementRoot
