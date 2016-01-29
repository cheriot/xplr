import React from 'react';

import MapViewActions from '../actions/map_view_actions';
import NavigationAutocomplete from './navigation_autocomplete';

class Home extends React.Component {

  render() {
    return (
      <div className='container container-narrow'>
        <NavigationAutocomplete />
      </div>
    );
  }

}

module.exports = Home
