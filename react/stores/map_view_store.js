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

  handleMapConnect([maps, mapWrapperDom]) {
    // Have we created a map already? If so, reuse that dom node to work around:
    // https://code.google.com/p/gmaps-api-issues/issues/detail?id=3803
    if (!this.mapCanvasDom) {
      // First map render!
      console.log('first map render!');

      // The map will not appear until told which part of
      // the world to show.
      const domNode = document.createElement("div");
      domNode.id = 'map-canvas';
      mapWrapperDom.appendChild(domNode);

      const gMap = new maps.Map(domNode, {
        mapTypeId: google.maps.MapTypeId.TERRAIN
      });
      this.setState({
        mapCanvasDom: domNode,
        map: this.createDestinationMap(gMap)
      });
      window.gMap = gMap; // debugging
    } else {
      mapWrapperDom.appendChild(this.mapCanvasDom);
    }
  }

  handleMapDisconnect() {
    // Remove from the dom and maintain the reference so we can reattach it
    // the next time a map is rendered.
    this.mapCanvasDom.remove();
    // preserve map instance, but remove listeners, markers, etc
    this.map.clean();
    // https://code.google.com/p/gmaps-api-issues/issues/detail?id=3803
    console.log('map disconnected');
  }

  createDestinationMap(gMap) {
    return new DestinationMap(new GoogleMap(gMap));
  }

}

module.exports = alt.createStore(MapViewStore, 'MapViewStore');
