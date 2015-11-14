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

  handleMapConnect(promise) {
    promise.then( ([maps, domNode]) => {
      const gMap = new maps.Map(domNode, {
        zoom: 2,
        center: {lat: 20.530892091775808, lng: 7.667925781250009},
        mapTypeId: google.maps.MapTypeId.TERRAIN
      });
      google.maps.event.trigger(gMap, 'resize');
      this.setState({map: this.createDestinationMap(gMap)});
      window.gMap = gMap; // easier debugging
    })
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
