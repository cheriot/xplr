import React from 'react/addons';

import MapViewActions from '../actions/map_view_actions';
import MapViewStore from '../stores/map_view_store';
import NavigationAutocomplete from './navigation_autocomplete';

class Home extends React.Component {

  componentDidMount() {
    MapViewStore.listen(state => this.setState(state))
    // MapViewActions.mapConnect(this.refs.mapRoot.getDOMNode());
  }

  componentWillUnmount() {
    MapViewStore.unlisten(this.handleChange);
    // MapViewActions.mapDisconnect(this.refs.mapRoot.getDOMNode());
  }

  render() {
    // const mapStyles = { height: '300px' };

    return (
      <div>
        <NavigationAutocomplete />
      </div>
    );
    // <div id='map-canvas' style={mapStyles} ref='mapRoot' />
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
