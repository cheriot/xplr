import React from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router';

import NavigationAutocomplete from './navigation_autocomplete';

class Root extends React.Component {
  render() {

    return (
      <div className='component-root'>
        <Helmet title="Where to?" />

        <div className='container card header'>
          <h1>
            <Link to='/'>Xplr</Link>
            <span className='subtitle'> the best in travel writing </span>
          </h1>

          <NavigationAutocomplete />
        </div>

        {this.props.children}

        <div className='footer' />
      </div>
    );

  }
}

module.exports = Root;
