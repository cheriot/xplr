import React from 'react';

import NavigationAutocomplete from './navigation_autocomplete';

class Root extends React.Component {
  render() {
    const brandTitle = {color: 'gray', fontSize: '23px'};
    const brandSubtitle = {color: 'lightgray', fontSize: '18px'};

    return (
      <div>
        <div className='container container-narrow header-branding'>
          <h1 style={brandTitle}>
            <a href='/'>Xplr.in</a>
            <span style={brandSubtitle}> the best in travel writing </span>
          </h1>
          <NavigationAutocomplete />
        </div>

        {this.props.children}
      </div>
    );
  }
}

module.exports = Root;
