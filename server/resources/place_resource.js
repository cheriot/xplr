import Place from '../models/place';

class PlaceResource {

  static updateOrCreate(googlePlace) {
    return Place.updateOrCreateFromRemote(googlePlace);
  }

}

module.exports = PlaceResource
