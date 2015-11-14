import _ from 'lodash';
import Place from '../models/place';

class PlaceResource {

  static fetch(id) {
    return Place.forge({id: id}).fetch();
  }

  static updateOrCreate(gPlace) {
    const forged = Place.forge({google_place_id: gPlace.id});
    return forged
      .fetch()
      .then(place => place || forged)
      .then(place => {
        place.updateFromGooglePlace(gPlace);
        return place.save();
      })
      .catch((message) => console.log('error', message) );
  }

  static nearByPlace(place) {
    return this.nearBy(this.bounds(place))
      .then(collection => {
        return _.filter(collection.models, found => found.id != place.id);
      });
  }

  static nearBy(bounds) {
    return Place
      .where('lat', '<', bounds.viewport_lat_north)
      .where('lat', '>', bounds.viewport_lat_south)
      .where('lon', '<', bounds.viewport_lon_east)
      .where('lon', '>', bounds.viewport_lon_west)
      .where('geo_level', 'city')
      .fetchAll()
  }

  static bounds(place) {
    return place.attributes;
  }
}

module.exports = PlaceResource
