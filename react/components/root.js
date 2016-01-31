import React from 'react';

import NavigationAutocomplete from './navigation_autocomplete';

class Root extends React.Component {
  render() {
    const titleStyles = {color: 'gray', fontSize: '23px', display: 'inline-block'};
    const subtitleStyles = {color: 'lightgray', fontSize: '18px'};
    const navigationStyles = {display: 'inline-block'};

    return (
      <div className='component-root'>
        <div className='container container-narrow card header-branding'>
          <h1 style={titleStyles}>
            <a href='/'>Xplr.in</a>
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
