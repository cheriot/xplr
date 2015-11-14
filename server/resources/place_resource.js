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

  static nearBy(place) {
    return Place.where('lat', '<', place.get('viewport_lat_north'))
      .where('lat', '>', place.get('viewport_lat_south'))
      .where('lon', '<', place.get('viewport_lon_east'))
      .where('lon', '>', place.get('viewport_lon_west'))
      .where('geo_level', 'city')
      .fetchAll()
      .then(collection => {
        return _.filter(collection.models, found => found.id != place.id);
      });
  }
}

module.exports = PlaceResource
