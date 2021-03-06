import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

class ManagementRoot extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Management" />
        <ul className='container container-narrow card'>
          <li>
            <Link to={`/management/queue`}>queue</Link>
          </li>
          <li>
            <Link to={`/management/feeds`}>feeds</Link>
          </li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}

module.exports = ManagementRoot
