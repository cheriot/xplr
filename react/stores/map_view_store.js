import alt from '../alt_dispatcher';

import MapViewActions from '../actions/map_view_actions';
import googleMapPromise from '../models/google_maps';
import GoogleMap from '../models/google_map';
import DestinationMap from '../models/destination_map';

class MapViewStore {

  constructor() {
    this.bindListeners({
      handleMapConnect: MapViewActions.MAP_CONNECT,
      handleMapDisconnect: MapViewActions.MAP_DISCONNECT,
    });
  }

  handleMapConnect([maps, domNode]) {
    // The map will not appear until told which part of
    // the world to show.
    const gMap = new maps.Map(domNode, {
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    this.setState({map: this.createDestinationMap(gMap)});
    window.gMap = gMap; // debugging
  }

  handleMapDisconnect(domNode) {
    // preserve map instance, but remove listeners
    console.log('TODO! map disconnect', domNode);
    // https://code.google.com/p/gmaps-api-issues/issues/detail?id=3803
  }

  createDestinationMap(gMap) {
    return new DestinationMap(new GoogleMap(gMap));
  }

}

module.exports = alt.createStore(MapViewStore, 'MapViewStore');
