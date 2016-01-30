import alt from '../alt_dispatcher';

// TODO: Convert googleMapPromise into a MapViewSource
import googleMapPromise from '../models/google_maps';

class MapViewActions {

  mapConnect(domNode) {
    googleMapPromise.then(maps => {
      this.dispatch([maps, domNode]);
    });
  }

  mapDisconnect(domNode) {
    googleMapPromise.then(maps => {
      this.dispatch([maps, domNode]);
    });
  }

}

module.exports = alt.createActions(MapViewActions);
