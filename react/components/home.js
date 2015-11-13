import React from 'react';

import MapViewActions from '../actions/map_view_actions';
import NavigationAutocomplete from './navigation_autocomplete';

class Home extends React.Component {

  render() {
    return (
      <div>
        <NavigationAutocomplete />
      </div>
    );
  }

}

class PlaceMap extends React.Component {

  // this.props
  // * map
  // * places[]
  // * each place
}

class FeedEntryList extends React.Component {
}

module.exports = Home
