import alt from '../alt_dispatcher';

import PlaceSource from '../sources/place_source';

class PlaceActions {

  createPlace(gPlace) {
    return PlaceSource.create(gPlace);
  }

}

module.exports = alt.createActions(PlaceActions);
