import React from 'react/addons';

import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';
import NavigationAutocomplete from './navigation_autocomplete';

class Home extends React.Component {

  componentDidMount() {
    MapViewStore.listen(state => this.setState(state))
  }

  componentWillUnmount() {
    MapViewStore.unlisten(this.handleChange);
  }

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
