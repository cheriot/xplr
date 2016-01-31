import React from 'react';
import Helmet from 'react-helmet';
import {Link} from 'react-router';

import NavigationAutocomplete from './navigation_autocomplete';

class Root extends React.Component {
  render() {
    const titleStyles = {color: 'gray', fontSize: '23px', display: 'inline-block'};
    const subtitleStyles = {color: 'lightgray', fontSize: '18px'};
    const navigationStyles = {display: 'inline-block'};

    return (
      <div className='component-root'>
        <Helmet title="Where to?" />

        <div className='container container-narrow card header-branding'>
          <h1 style={titleStyles}>
            <Link to='/'>Xplr.in</Link>
            <span style={subtitleStyles}> the best in travel writing </span>
          </h1>

          <NavigationAutocomplete style={navigationStyles} />
        </div>

        {this.props.children}

        <div className='footer' />
      </div>
    );
  }
}

module.exports = Root;
