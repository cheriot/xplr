import alt from '../alt_dispatcher';

// TODO: Convert googleMapPromise into a MapViewSource
import googleMapPromise from '../models/google_maps';

class MapViewActions {

  mapConnect(domNode) {
    this.dispatch(googleMapPromise.then( maps => { return [maps, domNode]; } ));
  }

  mapDisconnect(domNode) {
    this.dispatch(googleMapPromise.then( maps => [maps, domNode] ));
  }

}

module.exports = alt.createActions(MapViewActions);
